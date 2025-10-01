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

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  stockQuantity: number;
  images: string[];
  createdAt: Date;
  updateAt: Date;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface PaginatedBooksResponse {
  data: Book[];
  meta: PaginationMeta;
}

export interface SingleBookResponse {
  data: Book;
}

export interface AddToCartRequest {
  bookId: number;
  quantity: number;
}

export interface AddToCartResponse {
  message: string;
}
