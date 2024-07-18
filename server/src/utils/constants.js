import dotenv from "dotenv";

dotenv.config();

export const DB_CONNECT = process.env.MONGODB_URI;
export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;
