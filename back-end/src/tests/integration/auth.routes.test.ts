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

    expect(res.body.token).toEqual(expect.any(String));
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

    expect(res.body.message).toBe("All fields are required");
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

    expect(res.body.token).toEqual(expect.any(String));
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

    expect(res.body.message).toBe("All fields are required");
  });
});
