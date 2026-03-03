import supertest from "supertest";
import { app } from "../../index.js";
import { AppDataSource } from "../../config/database.js";
import { Book } from "../../entity/Book.js";
import { Cart } from "../../entity/Cart.js";

let token: string;
let seededBookId: number;
const TEST_EMAIL = `cart_test_${Date.now()}@storynix.test`;

describe("cart integration routes", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    const bookRepo = AppDataSource.getRepository(Book);
    const book = bookRepo.create({
      title: "Cart Test Book",
      author: "Cart Author",
      isbn: `CART-${Date.now()}`,
      price: 12.99,
      stockQuantity: 10,
    });
    const saved = await bookRepo.save(book);
    seededBookId = saved.id;

    await supertest(app).post("/api/auth/register").send({
      firstName: "Cart",
      lastName: "Tester",
      email: TEST_EMAIL,
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

    await AppDataSource.getRepository(Cart).delete({
      book: { id: seededBookId },
    });
    await AppDataSource.getRepository(Book).delete({ id: seededBookId });
    await AppDataSource.getRepository(User).delete({ email: TEST_EMAIL });
  });

  test("POST /cart/add returns 401 without token", async () => {
    const res = await supertest(app).post("/api/cart/add").expect(401);
    expect(res.body.message).toBe("Authorization header missing");
  });

  test("POST /cart/add returns 400 for missing bookId or quantity", async () => {
    const res = await supertest(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: seededBookId })
      .expect(400);

    expect(res.body.message).toBe("Book ID and quantity required");
  });

  test("POST /cart/add returns 404 for non-existent book", async () => {
    const res = await supertest(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: 999999999, quantity: 1 })
      .expect(404);

    expect(res.body.message).toBe("Book not found");
  });

  test("POST /cart/add returns 200 and adds item to cart", async () => {
    const res = await supertest(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: seededBookId, quantity: 3 })
      .expect(200);

    expect(res.body.message).toBe("Item added to cart");
    expect(res.body.cartItem.bookId).toBe(seededBookId);
    expect(res.body.cartItem.quantity).toBe(3);
  });

  test("POST /cart/add returns 400 when quantity would exceed stock", async () => {
    const res = await supertest(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: seededBookId, quantity: 9 })
      .expect(400);

    expect(res.body.message).toMatch(/Cannot add/);
  });

  test("GET /cart returns 200 with the user's cart items", async () => {
    const res = await supertest(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].book.id).toBe(seededBookId);
  });

  test("PUT /cart/update returns 200 and updates cart item quantity", async () => {
    const res = await supertest(app)
      .put("/api/cart/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: seededBookId, quantity: 2 })
      .expect(200);

    expect(res.body.message).toBe("Cart updated");
    expect(res.body.cartItem.quantity).toBe(2);
  });

  test("PUT /cart/update returns 400 for missing fields", async () => {
    const res = await supertest(app)
      .put("/api/cart/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: seededBookId })
      .expect(400);

    expect(res.body.message).toBe("Book ID and quantity required");
  });

  test("PUT /cart/update returns 404 for item not in cart", async () => {
    const res = await supertest(app)
      .put("/api/cart/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: 999999999, quantity: 1 })
      .expect(404);

    expect(res.body.message).toBe("Item not found in cart");
  });

  test("DELETE /cart/:bookId returns 200 and removes item", async () => {
    const res = await supertest(app)
      .delete(`/api/cart/${seededBookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("Item removed from cart");
  });

  test("DELETE /cart/clear returns 200 and clears the cart", async () => {
    await supertest(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: seededBookId, quantity: 1 });

    const res = await supertest(app)
      .delete("/api/cart/clear")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("Cart cleared successfully");
  });
});
