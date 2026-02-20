import {
  calculateOrderTotal,
  validateOrderItems,
  validateStockAvailability,
} from "../../services/orderRules.js";

describe("order rules", () => {
  test("calculateOrderTotal returns correct total for valid items", () => {
    const items = [
      { bookId: 1, quantity: 2, price: 10 },
      { bookId: 2, quantity: 1, price: 15.5 },
    ];

    const total = calculateOrderTotal(items);

    expect(total).toBe(35.5);
  });

  test("calculateOrderTotal returns 0 for empty items array", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  test("validateOrderItems throws when item quantity is <= 0", () => {
    const items = [{ bookId: 1, quantity: 0, price: 10 }];

    expect(() => validateOrderItems(items)).toThrow(
      "Quantity must be greater than 0",
    );
  });

  test("validateOrderItems throws when item bookId is missing or invalid", () => {
    const items = [{ bookId: 0, quantity: 1, price: 10 }];

    expect(() => validateOrderItems(items)).toThrow("Invalid bookId");
  });

  test("validateOrderItems throws when item bookId is not an integer", () => {
    const items = [{ bookId: 1.5, quantity: 1, price: 10 }];

    expect(() => validateOrderItems(items)).toThrow("Invalid bookId");
  });

  test("validateOrderItems throws when item quantity is not an integer", () => {
    const items = [{ bookId: 1, quantity: 1.2, price: 10 }];

    expect(() => validateOrderItems(items)).toThrow(
      "Quantity must be greater than 0",
    );
  });

  test("validateStockAvailability throws when requested quantity exceeds stock", () => {
    expect(() => validateStockAvailability(5, 3, 1)).toThrow(
      "Book 1 is out of stock or requested quantity (5) exceeds available stock (3).",
    );
  });

  test("validateOrderItems returns normalized valid items", () => {
    const items = [{ bookId: 1, quantity: 4, price: 15 }];

    expect(validateOrderItems(items)).toEqual(
      items.map((item) => ({ bookId: item.bookId, quantity: item.quantity })),
    );
  });

  test("validateOrderItems throws when orderItems is empty", () => {
    expect(() => validateOrderItems([])).toThrow(
      "Order must contain at least one item.",
    );
  });

  test("validateOrderItems throws when orderItems is not an array", () => {
    expect(() =>
      validateOrderItems({ bookId: 2, quantity: 4, price: 45 }),
    ).toThrow("Order must contain at least one item.");
  });

  test("validateStockAvailability does not throw when quantity equals stock", () => {
    const bookId = 2;
    const requestedQuantity = 5;
    const availableStock = 5;
    expect(() =>
      validateStockAvailability(requestedQuantity, availableStock, bookId),
    ).not.toThrow();
  });

  test("validateStockAvailability does not throw when requested quantity is below stock", () => {
    expect(() => validateStockAvailability(2, 10, 4)).not.toThrow();
  });

  test("calculateOrderTotal handles decimal prices correctly", () => {
    const items = [
      { bookId: 1, quantity: 1, price: 0.1 },
      { bookId: 2, quantity: 1, price: 0.2 },
    ];

    expect(calculateOrderTotal(items)).toBeCloseTo(0.3);
  });
});
