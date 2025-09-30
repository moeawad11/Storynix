export interface User {
  id: string;
  email: string;
  name: string;
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
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  items: {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
}
