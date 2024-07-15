import { check } from "express-validator";

export const LoginSchema = [
  check("email", "Email is required").exists().notEmpty().trim(),
  check("password", "Password is required")
    .exists()
    .isLength({ min: 6 })
    .trim(),
];
