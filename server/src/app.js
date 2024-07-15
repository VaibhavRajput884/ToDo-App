import express from "express";
import apiRoute, { apiProtected } from "./routes/api-routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ensureAccess  from "./middleware/account-auth.js";

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

const PORT = 8000;
app.use(cors());
app.use(express.json());
app.use("/api/", apiRoute);
app.use("/api/", ensureAccess, apiProtected);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
