import { check } from "express-validator";

export const LoginSchema = [
  check("identifier", "Username or Email is required").exists().trim(),
  check("password", "Password is required")
    .exists()
    .isLength({ min: 6 })
    .trim(),
];
