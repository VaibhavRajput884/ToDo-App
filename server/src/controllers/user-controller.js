import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import bcrypt from "bcrypt";
import User from "../models/user-model.js";
import jwt from "jsonwebtoken";

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

const createAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(jsonGenerate(400, "Validation error", errors.mapped()));
  }

  const { firstName, lastName, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(409).json(jsonGenerate(409, "User already exists"));
  }

  try {
    const result = await User.create({
      firstName,
      lastName,
      email,
      hashedPassword,
    });

    const token = jwt.sign({ userId: result._id }, JWT_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json(
      jsonGenerate(201, "Registration successful", {
        user: result,
        token,
      })
    );
  } catch (error) {
    res.status(500).json(jsonGenerate(500, "Database error", error));
  }
};

export default createAccount;
