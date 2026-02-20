import { createPaymentIntent } from "../../services/paymentService.js";

describe("payment service", () => {
  test("createPaymentIntent sets mock paymentIntentId and returns client secret", async () => {
    const order = {
      id: 42,
      paymentIntentId: null,
    } as any;

    const result = await createPaymentIntent(order);

    expect(result.order).toBe(order);
    expect(order.paymentIntentId).toMatch(/^pi_mock_\d+$/);
    expect(result.clientSecret).toMatch(/^mock_client_secret_42_\d+$/);
  });

  test("createPaymentIntent preserves order id in generated client secret", async () => {
    const order = {
      id: 7,
      paymentIntentId: null,
    } as any;

    const result = await createPaymentIntent(order);

    expect(result.clientSecret).toContain("mock_client_secret_7_");
  });
});
