import { ShippingFormData } from "../types/index.js";

export const getShippingAddress = () => {
  try {
    const saved = sessionStorage.getItem("shippingAddress");
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Failed to parse shipping address:", err);
    return null;
  }
};

export const saveShippingAddress = (address: ShippingFormData) => {
  sessionStorage.setItem("shippingAddress", JSON.stringify(address));
};

export const clearShippingAddress = () => {
  sessionStorage.removeItem("shippingAddress");
};
