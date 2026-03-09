import supertest from "supertest";
import { app } from "../../index.js";
import { AppDataSource } from "../../config/data-source.js";
import { Book } from "../../entity/Book.js";

let adminToken: string;
let regularToken: string;
let createdBookId: number;
let seededBookId: number;

const ADMIN_EMAIL = `admin_test_${Date.now()}@storynix.test`;
const REGULAR_EMAIL = `regular_test_${Date.now()}@storynix.test`;

describe("admin integration routes", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    const { User } = await import("../../entity/User.js");
    const userRepo = AppDataSource.getRepository(User);

    await supertest(app).post("/api/auth/register").send({
      firstName: "Admin",
      lastName: "Tester",
      email: ADMIN_EMAIL,
      password: "P@ssword123",
    });
    await userRepo.update({ email: ADMIN_EMAIL }, { role: "admin" });
    const adminLogin = await supertest(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: "P@ssword123" })
      .expect(200);
    adminToken = adminLogin.headers["set-cookie"]?.[0]?.split(";")[0] ?? "";

    await supertest(app).post("/api/auth/register").send({
      firstName: "Regular",
      lastName: "Tester",
      email: REGULAR_EMAIL,
      password: "P@ssword123",
    });
    const regularLogin = await supertest(app)
      .post("/api/auth/login")
      .send({ email: REGULAR_EMAIL, password: "P@ssword123" })
      .expect(200);
    regularToken = regularLogin.headers["set-cookie"]?.[0]?.split(";")[0] ?? "";

    const bookRepo = AppDataSource.getRepository(Book);
    const book = bookRepo.create({
      title: "Admin Seeded Book",
      author: "Admin Author",
      isbn: `ADMIN-SEED-${Date.now()}`,
      price: 9.99,
      stockQuantity: 5,
    });
    const saved = await bookRepo.save(book);
    seededBookId = saved.id;
  });

  afterAll(async () => {
    const { User } = await import("../../entity/User.js");
    const userRepo = AppDataSource.getRepository(User);
    const bookRepo = AppDataSource.getRepository(Book);
    if (seededBookId) await bookRepo.delete({ id: seededBookId });

    if (createdBookId) await bookRepo.delete({ id: createdBookId });

    await userRepo.delete({ email: ADMIN_EMAIL });
    await userRepo.delete({ email: REGULAR_EMAIL });
  });

  test("GET /admin/stats returns 401 without token", async () => {
    const res = await supertest(app).get("/api/admin/stats").expect(401);
    expect(res.body.message).toBe("Not authenticated");
  });

  test("GET /admin/stats returns 403 for regular user", async () => {
    const res = await supertest(app)
      .get("/api/admin/stats")
      .set("Cookie", regularToken)
      .expect(403);

    expect(res.body.message).toBe(
      "User not authorized to access this resource",
    );
  });

  test("GET /admin/stats returns 200 with dashboard stats for admin", async () => {
    const res = await supertest(app)
      .get("/api/admin/stats")
      .set("Cookie", adminToken)
      .expect(200);

    expect(res.body).toHaveProperty("totalOrders");
    expect(res.body).toHaveProperty("totalUsers");
    expect(res.body).toHaveProperty("totalBooks");
    expect(res.body).toHaveProperty("totalSales");
    expect(Array.isArray(res.body.recentOrders)).toBe(true);
  });

  test("POST /admin/books returns 400 for missing required fields", async () => {
    const res = await supertest(app)
      .post("/api/admin/books")
      .set("Cookie", adminToken)
      .send({ title: "Incomplete Book" })
      .expect(400);

    expect(res.body.message).toBe(
      "Invalid input: expected string, received undefined",
    );
  });

  test("POST /admin/books returns 201 and creates a book", async () => {
    const isbn = `NEW-${Date.now()}`;
    const res = await supertest(app)
      .post("/api/admin/books")
      .set("Cookie", adminToken)
      .send({
        title: "New Admin Book",
        author: "New Author",
        isbn,
        price: 24.99,
        stockQuantity: 20,
      })
      .expect(201);

    expect(res.body.message).toBe("Book created successfully.");
    expect(res.body.book).toMatchObject({
      title: "New Admin Book",
      author: "New Author",
    });

    if (res.body.book?.id) createdBookId = res.body.book.id;
  });

  test("POST /admin/books returns 409 for duplicate ISBN", async () => {
    const bookRepo = AppDataSource.getRepository(Book);
    const existing = await bookRepo.findOneBy({ id: seededBookId });

    const res = await supertest(app)
      .post("/api/admin/books")
      .set("Cookie", adminToken)
      .send({
        title: "Duplicate",
        author: "Author",
        isbn: existing!.isbn,
        price: 10,
        stockQuantity: 1,
      })
      .expect(409);

    expect(res.body.message).toBe("A book with this ISBN already exists.");
  });

  test("PUT /admin/books/:id returns 404 for non-existent book", async () => {
    const res = await supertest(app)
      .put("/api/admin/books/999999999")
      .set("Cookie", adminToken)
      .send({
        title: "Ghost",
        author: "Ghost",
        isbn: "GHOST-999",
        price: 5,
        stockQuantity: 1,
      })
      .expect(404);

    expect(res.body.message).toMatch(/not found/i);
  });

  test("PUT /admin/books/:id returns 200 and updates book", async () => {
    const res = await supertest(app)
      .put(`/api/admin/books/${seededBookId}`)
      .set("Cookie", adminToken)
      .send({
        title: "Updated Admin Book",
        author: "Updated Author",
        isbn: `ADMIN-UPDATED-${Date.now()}`,
        price: 14.99,
        stockQuantity: 8,
      })
      .expect(200);

    expect(res.body.message).toBe("Book updated successfully.");
    expect(res.body.book.title).toBe("Updated Admin Book");
  });

  test("GET /admin/orders returns 200 with all orders for admin", async () => {
    const res = await supertest(app)
      .get("/api/admin/orders")
      .set("Cookie", adminToken)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test("DELETE /admin/books/:id returns 200 and deletes the book", async () => {
    const res = await supertest(app)
      .delete(`/api/admin/books/${seededBookId}`)
      .set("Cookie", adminToken)
      .expect(200);

    expect(res.body.message).toMatch(/deleted successfully/i);
    seededBookId = 0;
  });
});
