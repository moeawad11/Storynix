export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface Order {
  id: string;
  totalPrice: number;
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  orderItems: {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
}
