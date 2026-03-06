import supertest from "supertest";
import { app } from "../../index.js";
import { AppDataSource } from "../../config/data-source.js";

let token: string;
const TEST_EMAIL = `user_test_${Date.now()}@storynix.test`;
const TEST_EMAIL_OTHER = `user_other_${Date.now()}@storynix.test`;

describe("user integration routes", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    await supertest(app).post("/api/auth/register").send({
      firstName: "User",
      lastName: "Tester",
      email: TEST_EMAIL,
      password: "P@ssword123",
    });

    await supertest(app).post("/api/auth/register").send({
      firstName: "Other",
      lastName: "User",
      email: TEST_EMAIL_OTHER,
      password: "P@ssword123",
    });

    const loginRes = await supertest(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: "P@ssword123" })
      .expect(200);

    token = loginRes.body.token;
  });

  afterAll(async () => {
    const { User } = await import("../../entity/User.js");
    const userRepo = AppDataSource.getRepository(User);
    await userRepo.delete({ email: TEST_EMAIL });
    await userRepo.delete({ email: TEST_EMAIL_OTHER });
  });

  test("GET /users/profile returns 401 without token", async () => {
    const res = await supertest(app).get("/api/users/profile").expect(401);
    expect(res.body.message).toBe("Authorization header missing");
  });

  test("GET /users/profile returns 200 with user data from token", async () => {
    const res = await supertest(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.user.email).toBe(TEST_EMAIL);
    expect(res.body.user.password).toBeUndefined();
  });

  test("PUT /users/profile returns 401 without token", async () => {
    const res = await supertest(app).put("/api/users/profile").expect(401);
    expect(res.body.message).toBe("Authorization header missing");
  });

  test("PUT /users/profile returns 400 for missing required fields", async () => {
    const res = await supertest(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "User" })
      .expect(400);

    expect(res.body.message).toBe(
      "First name, last name, and email are required",
    );
  });

  test("PUT /users/profile returns 409 when email is taken by another user", async () => {
    const res = await supertest(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "User",
        lastName: "Tester",
        email: TEST_EMAIL_OTHER,
      })
      .expect(409);

    expect(res.body.message).toBe("Email already in use");
  });

  test("PUT /users/profile returns 401 when current password is wrong", async () => {
    const res = await supertest(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "User",
        lastName: "Tester",
        email: TEST_EMAIL,
        currentPassword: "WrongPassword!",
        newPassword: "NewP@ss123",
      })
      .expect(401);

    expect(res.body.message).toBe("Current password is incorrect");
  });

  test("PUT /users/profile returns 200 and updates name successfully", async () => {
    const res = await supertest(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Updated",
        lastName: "Name",
        email: TEST_EMAIL,
      })
      .expect(200);

    expect(res.body.message).toBe("Profile updated successfully");
    expect(res.body.user.firstName).toBe("Updated");
    expect(res.body.user.password).toBeUndefined();
  });
});
