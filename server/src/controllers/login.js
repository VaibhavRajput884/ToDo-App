import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        jsonGenerate(
          StatusCode.VALIDATION_ERROR,
          "Validation error",
          errors.array()
        )
      );
  }

  const { identifier, password } = req.body;

  try {
    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res
        .status(404)
        .json(
          jsonGenerate(
            StatusCode.UNPROCESSABLE_ENTITY,
            "Username, Email, or Password is incorrect"
          )
        );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json(
          jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Password is incorrect")
        );
    }

    const token = jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Login Successful", {
        userId: user._id,
        token,
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(jsonGenerate(StatusCode.DATABASE_ERROR, "Server error"));
  }
};

export default Login;
