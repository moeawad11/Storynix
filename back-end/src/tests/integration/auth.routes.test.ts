import supertest from "supertest";
import { app } from "../../index.js";
import { AppDataSource } from "../../config/data-source.js";
import { User } from "../../entity/User.js";

const TEST_EMAIL = `auth_test_${Date.now()}@storynix.test`;

describe("auth routes integration", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.getRepository(User).delete({ email: TEST_EMAIL });
  });

  test("POST /register returns 201 with token on valid payload", async () => {
    const res = await supertest(app)
      .post("/api/auth/register")
      .send({
        firstName: "Integration",
        lastName: "Tester",
        email: TEST_EMAIL,
        password: "P@ssword123",
      })
      .expect(201);

    expect(res.headers["set-cookie"]?.[0]).toMatch(/^token=/);
    expect(res.body.user.email).toBe(TEST_EMAIL);
    expect(res.body.user.password).toBeUndefined();
  });

  test("POST /register returns 400 for missing fields", async () => {
    const res = await supertest(app)
      .post("/api/auth/register")
      .send({
        firstName: "Integration",
        lastName: "Tester",
        email: TEST_EMAIL,
      })
      .expect(400);

    expect(res.body.message).toBe(
      "Invalid input: expected string, received undefined",
    );
  });

  test("POST /register returns 409 for duplicate email", async () => {
    const res = await supertest(app)
      .post("/api/auth/register")
      .send({
        firstName: "Integration",
        lastName: "Tester",
        email: TEST_EMAIL,
        password: "P@ssword123",
      })
      .expect(409);

    expect(res.body.message).toBe("Email already in use");
  });

  test("POST /login returns 200 with token on valid credentials", async () => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({
        firstName: "Integration",
        lastName: "Tester",
        email: TEST_EMAIL,
        password: "P@ssword123",
      })
      .expect(200);

    expect(res.headers["set-cookie"]?.[0]).toMatch(/^token=/);
    expect(res.body.user.email).toBe(TEST_EMAIL);
    expect(res.body.user.password).toBeUndefined();
  });

  test("POST /login returns 401 for wrong password", async () => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({
        firstName: "Integration",
        lastName: "Tester",
        email: TEST_EMAIL,
        password: "P@ssword12",
      })
      .expect(401);

    expect(res.body.message).toBe("Invalid password");
  });

  test("POST /login returns 401 for non-existent email", async () => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({
        email: "nobody_here@storynix.test",
        password: "P@ssword123",
      })
      .expect(401);

    expect(res.body.message).toBe("User does not exist");
  });

  test("POST /login returns 400 for missing fields", async () => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL })
      .expect(400);

    expect(res.body.message).toBe(
      "Invalid input: expected string, received undefined",
    );
  });

  test("POST /register sets httpOnly cookie with correct flags", async () => {
    const res = await supertest(app)
      .post("/api/auth/register")
      .send({
        firstName: "Cookie",
        lastName: "Tester",
        email: `cookie_flags_${Date.now()}@storynix.test`,
        password: "P@ssword123",
      })
      .expect(201);

    // Clean up
    await AppDataSource.getRepository(User).delete({
      email: res.body.user.email,
    });

    const cookieHeader = res.headers["set-cookie"]?.[0] ?? "";
    expect(cookieHeader.toLowerCase()).toMatch(/httponly/);
    expect(cookieHeader.toLowerCase()).toMatch(/samesite=lax/);
    expect(cookieHeader).toMatch(/^token=/);
  });

  test("POST /logout returns 200 and clears the token cookie", async () => {
    const loginRes = await supertest(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: "P@ssword123" })
      .expect(200);

    const cookie = loginRes.headers["set-cookie"]?.[0]?.split(";")[0] ?? "";

    const logoutRes = await supertest(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie)
      .expect(200);

    expect(logoutRes.body.message).toBe("Logged out successfully");

    const clearedCookie = logoutRes.headers["set-cookie"]?.[0] ?? "";
    expect(clearedCookie).toMatch(/token=/);
    expect(clearedCookie.toLowerCase()).toMatch(/expires|max-age=0/);
  });

  test("accessing protected route after logout returns 401", async () => {
    const loginRes = await supertest(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: "P@ssword123" })
      .expect(200);

    const cookie = loginRes.headers["set-cookie"]?.[0]?.split(";")[0] ?? "";

    await supertest(app)
      .get("/api/users/profile")
      .set("Cookie", cookie)
      .expect(200);

    await supertest(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie)
      .expect(200);

    const res = await supertest(app).get("/api/users/profile").expect(401);
    expect(res.body.message).toBe("Not authenticated");
  });

  test("auth routes return 429 after exceeding rate limit", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      for (let i = 0; i < 10; i++) {
        await supertest(app)
          .post("/api/auth/login")
          .send({ email: "ratelimit@storynix.test", password: "wrong" });
      }

      const res = await supertest(app)
        .post("/api/auth/login")
        .send({ email: "ratelimit@storynix.test", password: "wrong" });

      expect(res.status).toBe(429);
      expect(res.body.message).toBe(
        "Too many attempts, please try again later.",
      );
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});
