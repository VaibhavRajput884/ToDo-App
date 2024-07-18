import { JWT_TOKEN_SECRET } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";
import Jwt from "jsonwebtoken";

const ensureAccess  = (req, res, next) => {
  if (req.headers["auth"] === undefined) {
    return res.status(401).json(jsonGenerate(401, "Access Denied"));
  }

  const token = req.headers["auth"];

  try {
    const decoded = Jwt.verify(token, JWT_TOKEN_SECRET);

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.status(422).json(jsonGenerate(422, "Invalid Token"));
  }
};

export default ensureAccess ;
