import dotenv from "dotenv";

dotenv.config();

export const DB_CONNECT = process.env.MONGODB_URI;
export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

export const StatusCode = {
  SUCCESS: 200,
  VALIDATION_ERROR: 201,
  UNPROCESSABLE_ENTITY: 202,
  DATABASE_ERROR: 203,
  AUTH_ERROR: 204,
  INTERNAL_SERVER_ERROR: 205,
};
