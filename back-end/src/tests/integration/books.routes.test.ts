import supertest from "supertest";
import { app } from "../../index.js";
import { AppDataSource } from "../../config/data-source.js";
import { Book } from "../../entity/Book.js";

let seededBookId: number;

describe("books integration routes", () => {
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
    const saved = await bookRepo.save(book);
    seededBookId = saved.id;
  });

  afterAll(async () => {
    await AppDataSource.getRepository(Book).delete({ id: seededBookId });
  });

  test("GET /books returns 200 with paginated data", async () => {
    const res = await supertest(app).get("/api/books").expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.totalItems).toBeGreaterThan(0);
  });

  test("GET /books/:id returns 200 with correct book", async () => {
    const res = await supertest(app)
      .get(`/api/books/${seededBookId}`)
      .expect(200);

    expect(res.body.data.id).toBe(seededBookId);
    expect(res.body.data.title).toBe("Test Book");
  });

  test("GET /books/:id returns 404 for non-existent book", async () => {
    const id = 102392309;
    const res = await supertest(app).get(`/api/books/${id}`).expect(404);

    expect(res.body.message).toBe(`Book with ID ${id} not found.`);
  });

  test("GET /books/:id returns 400 for invalid ID format", async () => {
    const res = await supertest(app).get("/api/books/asw").expect(400);

    expect(res.body.message).toBe("Invalid book ID format.");
  });

  test("GET /books?search= returns filtered results", async () => {
    const res = await supertest(app).get("/api/books?search=Test").expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(
      res.body.data.every((b: { title: string }) =>
        b.title.toLowerCase().includes("test"),
      ),
    ).toBe(true);
  });

  test("GET /books?author= returns filtered results", async () => {
    const res = await supertest(app)
      .get("/api/books?author=Test Author")
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(
      res.body.data.every(
        (b: { author: string }) => b.author === "Test Author",
      ),
    ).toBe(true);
  });

  test("GET /books?limit=&page= applies pagination meta correctly", async () => {
    const res = await supertest(app)
      .get("/api/books?limit=5&page=1")
      .expect(200);

    expect(res.body.meta.currentPage).toBe(1);
    expect(res.body.meta.itemsPerPage).toBe(5);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });
});
