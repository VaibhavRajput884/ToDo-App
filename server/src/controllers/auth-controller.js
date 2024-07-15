import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { JWT_TOKEN_SECRET, StatusCode } from "../utils/constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const createAccessToken  = async (req, res) => {
  //Validate request
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

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(
          jsonGenerate(
            StatusCode.UNPROCESSABLE_ENTITY,
            "Email or Password is incorrect"
          )
        );
    }
      // Check password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res
        .status(400)
        .json(
          jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Password is incorrect")
        );
    }
     // Generate token
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
    return res
      .status(500)
      .json(jsonGenerate(StatusCode.DATABASE_ERROR, "Server error"));
  }
};

export default createAccessToken ;
