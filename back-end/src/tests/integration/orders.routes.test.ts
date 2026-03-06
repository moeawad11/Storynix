import supertest from "supertest";
import { app } from "../../index.js";
import { AppDataSource } from "../../config/data-source.js";
import { Book } from "../../entity/Book.js";

let token: string;
let seededBookId: number;
let testUserId: number;
const TEST_EMAIL = `auth_test_${Date.now()}@storynix.test`;
let TEST_EMAIL_B: string;
let orderId: number;

describe("order integration routes", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    const bookRepo = AppDataSource.getRepository(Book);

    const book = bookRepo.create({
      title: "Test Book",
      author: "Test Author",
      isbn: `TEST-${Date.now()}`,
      price: 19.99,
      stockQuantity: 10,
    });

    const res = await bookRepo.save(book);
    seededBookId = res.id;

    await supertest(app).post("/api/auth/register").send({
      firstName: "Integration",
      lastName: "Tester",
      email: TEST_EMAIL,
      password: "P@ssword123",
    });

    const loginRes = await supertest(app)
      .post("/api/auth/login")
      .send({
        email: TEST_EMAIL,
        password: "P@ssword123",
      })
      .expect(200);

    expect(loginRes.body.user.email).toBe(TEST_EMAIL);
    expect(loginRes.body.token).toEqual(expect.any(String));
    expect(loginRes.body.user.password).toBeUndefined();

    token = loginRes.body.token;
    testUserId = loginRes.body.user.id;
  });

  afterAll(async () => {
    await AppDataSource.getRepository(Book).delete({ id: seededBookId });
    const { User } = await import("../../entity/User.js");
    const { Order } = await import("../../entity/Order.js");

    const userRepo = AppDataSource.getRepository(User);
    const orderRepo = AppDataSource.getRepository(Order);

    if (orderId) await orderRepo.delete({ id: orderId });

    await userRepo.delete({ email: TEST_EMAIL });
    if (TEST_EMAIL_B) await userRepo.delete({ email: TEST_EMAIL_B });
  });

  test("POST /orders returns 401 without token", async () => {
    const res = await supertest(app).post("/api/orders").expect(401);

    expect(res.body.message).toBe("Authorization header missing");
  });

  test("POST /orders returns 400 for invalid payload/out-of-stock", async () => {
    const res = await supertest(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderItems: [{ bookId: seededBookId, quantity: -2 }],
        shippingAddress: "Test Address",
        paymentMethod: "CARD",
      })
      .expect(400);

    expect(res.body.message).toBe("Quantity must be greater than 0");
  });

  test("POST /orders returns 400 for invalid bookId", async () => {
    const res = await supertest(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderItems: [{ bookId: -2, quantity: -2 }],
        shippingAddress: "Test Address",
        paymentMethod: "CARD",
      })
      .expect(400);

    expect(res.body.message).toBe("Invalid bookId");
  });

  test("POST /orders returns 201 with valid token + seeded book", async () => {
    const testOrderItems = [
      { bookId: seededBookId, quantity: 3, title: "Test Book", price: 19.99 },
    ];
    const res = await supertest(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderItems: [{ bookId: seededBookId, quantity: 3 }],
        shippingAddress: "Test Address",
        paymentMethod: "CARD",
      })
      .expect(201);

    orderId = res.body.orderId;
    expect(res.body.message).toBe(
      "Order initialized successfully. Awaiting payment confirmation.",
    );
    expect(res.body.order.orderItems).toEqual(testOrderItems);
    expect(res.body.order.user.id).toBe(testUserId);
  });

  test("GET /orders/myorders returns 200 with user's orders", async () => {
    const res = await supertest(app)
      .get("/api/orders/myorders")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });

  test("GET /orders/myorders returns 401 without tokens", async () => {
    const res = await supertest(app).get("/api/orders/myorders").expect(401);

    expect(res.body.message).toBe("Authorization header missing");
  });

  test("GET /orders/:id returns 400 for invalid ID format", async () => {
    const res = await supertest(app)
      .get("/api/orders/abc")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    expect(res.body.message).toBe("Invalid order ID format.");
  });

  test("GET /orders/:id returns 200 for user's own order", async () => {
    const res = await supertest(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.order.id).toBe(orderId);
  });

  test("GET /orders/:id returns 404 for another user's order (ownership guard)", async () => {
    TEST_EMAIL_B = `auth_test_2_${Date.now()}@storynix.test`;
    await supertest(app).post("/api/auth/register").send({
      firstName: "User",
      lastName: "B",
      email: TEST_EMAIL_B,
      password: "Password123!",
    });

    const loginResB = await supertest(app).post("/api/auth/login").send({
      email: TEST_EMAIL_B,
      password: "Password123!",
    });

    const userBToken = loginResB.body.token;

    const res = await supertest(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${userBToken}`)
      .expect(404);

    expect(res.body.message).toMatch(/not found/i);
  });
});
