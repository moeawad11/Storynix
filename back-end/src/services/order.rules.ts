export interface IncomingOrderItem {
  bookId: number;
  quantity: number;
}

export interface PricedOrderItem {
  price: number;
  quantity: number;
}

export const calculateOrderTotal = (items: PricedOrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const validateOrderItems = (
  orderItems: unknown,
): IncomingOrderItem[] => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  return orderItems.map((item) => {
    const typedItem = item as Partial<IncomingOrderItem>;

    if (
      !typedItem.bookId ||
      !Number.isInteger(typedItem.bookId) ||
      typedItem.bookId <= 0
    ) {
      throw new Error("Invalid bookId");
    }

    if (
      !typedItem.quantity ||
      !Number.isInteger(typedItem.quantity) ||
      typedItem.quantity <= 0
    ) {
      throw new Error("Quantity must be greater than 0");
    }

    return {
      bookId: typedItem.bookId,
      quantity: typedItem.quantity,
    };
  });
};

export const validateStockAvailability = (
  requestedQuantity: number,
  availableStock: number,
  bookId: number,
): void => {
  if (requestedQuantity > availableStock) {
    throw new Error(
      `Book ${bookId} is out of stock or requested quantity (${requestedQuantity}) exceeds available stock (${availableStock}).`,
    );
  }
};
