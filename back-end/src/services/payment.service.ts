import { Order } from "../entity/Order.js";

interface PaymentIntentResult{
  order: Order;
  clientSecret: string
}

export const createPaymentIntent = async (order: Order): Promise<PaymentIntentResult> =>{
    order.paymentIntentId = `pi_mock_${Date.now()}`;

    await new Promise(resolve => setTimeout(resolve,100)); 

    return {
        order: order,
        clientSecret: `mock_client_secret_${order.id}_${Date.now()}`
    };
};
