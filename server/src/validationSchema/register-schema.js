import { check } from "express-validator";
export const RegisterSchema = [
  // check("username").trim().isAlpha().withMessage("Username is Required"),
  check("username")
    .trim()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username is Required"),
  check("name").trim().isAlpha().withMessage("Name should be in Alphabets only"),
  check("password", "Password is required")
    .exists()
    .isLength({ min: 6, max: 100 })
    .trim(),
  check("email", "Email is required").exists().isEmail(),
];
