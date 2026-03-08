import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        console.error("Validation errors:", formattedErrors);

        return res
          .status(400)
          .json({ message: formattedErrors[0].message || "Validation failed" });
      }
      return res
        .status(500)
        .json({ message: "Internal server error during validation" });
    }
  };
