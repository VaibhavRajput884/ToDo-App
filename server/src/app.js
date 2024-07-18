import express from "express";
import todoRoutes from "./routes/todo-router.js";
import loginRoute from "./routes/access-token-router.js";
import createUserRoutes from "./routes/user-router.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

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
app.use("/api/users", createUserRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api", loginRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
