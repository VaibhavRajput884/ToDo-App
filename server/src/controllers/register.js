import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { username, name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json(
        jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "User Already exists")
      );
    }

    // Save to db
    try {
      const result = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: result._id }, JWT_TOKEN_SECRET, {
        expiresIn: "1h",
      }); // Generate JWT token

      res.json(
        jsonGenerate(StatusCode.SUCCESS, "Registration successful", {
          user: result,
          token,
        })
      );
    } catch (error) {
      console.log(error);
      res.json(jsonGenerate(StatusCode.DATABASE_ERROR, "Database error", {}));
    }
  } else {
    res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "Validation error",
        errors.mapped()
      )
    );
  }
};

export default Register;
