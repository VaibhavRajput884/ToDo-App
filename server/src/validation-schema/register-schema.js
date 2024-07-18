import { check } from "express-validator";
const RegisterSchema = [
  check("firstName", "First Name is required").exists().notEmpty().trim(),
  check("lastName", "Last Name is required").exists().notEmpty().trim(),
  check("email", "Email is required").exists().isEmail().trim(),
  check("password", "Password is required")
    .exists()
    .isLength({ min: 6 })
    .trim(),
];
export default RegisterSchema;
