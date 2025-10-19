import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Storynix API Documentation",
      version: "1.0.0",
      description: "REST API documentation for the Storynix bookstore app",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              example: "johndoe@example.com",
            },
            role: {
              type: "string",
              example: "user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-19T20:30:00.000Z",
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            bookId: {
              type: "integer",
              example: 7,
            },
            title: {
              type: "string",
              example: "The Art of Clean Code",
            },
            author: {
              type: "string",
              example: "Robert Martin",
            },
            price: {
              type: "number",
              example: 29.99,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            stockQuantity: {
              type: "integer",
              example: 15,
            },
            image: {
              type: "string",
              example:
                "https://placehold.co/300x450/6366f1/ffffff?text=Clean+Code",
            },
          },
        },
        Book: {
          type: "object",
          properties: {
            id: { type: "integer", example: 8 },
            title: { type: "string", example: "Galactic Horizons" },
            author: { type: "string", example: "Evan Solaris" },
            isbn: { type: "string", example: "978-1-23456-789-0" },
            description: {
              type: "string",
              example:
                "Epic sci-fi adventure of explorers discovering uncharted galaxies.",
            },
            price: { type: "number", example: 27.5 },
            stockQuantity: { type: "integer", example: 5 },
            images: {
              type: "array",
              items: { type: "string" },
              example: [
                "https://placehold.co/300x450/6366f1/ffffff?text=Galactic+Horizons",
              ],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-01T14:22:08.392Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-05T21:06:18.298Z",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", example: 12 },
            userId: { type: "integer", example: 1 },
            orderItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  bookId: { type: "integer", example: 3 },
                  title: { type: "string", example: "Galactic Horizons" },
                  quantity: { type: "integer", example: 2 },
                  price: { type: "number", example: 27.5 },
                },
              },
            },
            shippingAddress: {
              type: "string",
              example: "742 Evergreen Terrace, Springfield",
            },
            paymentMethod: { type: "string", example: "Credit Card" },
            totalPrice: { type: "number", example: 55.0 },
            orderStatus: { type: "string", example: "Processing" },
            isPaid: { type: "boolean", example: false },
            isDelivered: { type: "boolean", example: false },
            paidAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-19T21:00:00.000Z",
            },
            deliveredAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-22T14:30:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-10-19T20:45:00.000Z",
            },
          },
        },
        AdminDashboardStats: {
          type: "object",
          properties: {
            totalSales: { type: "string", example: "1542.75" },
            totalOrders: { type: "integer", example: 38 },
            totalUsers: { type: "integer", example: 57 },
            totalBooks: { type: "integer", example: 25 },
            recentOrders: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 10 },
                  totalPrice: { type: "number", example: 49.99 },
                  orderStatus: { type: "string", example: "Delivered" },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    example: "2025-10-19T19:00:00.000Z",
                  },
                  customerName: { type: "string", example: "John Doe" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
