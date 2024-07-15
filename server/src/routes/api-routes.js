import express from "express";
import { RegisterSchema } from "../validation-schema/register-schema.js";
import { LoginSchema } from "../validation-schema/login-schema.js";
import { createTodo, deleteTodo, filterTodos, toggleCompleteStatus, updateTodo,getTodos } from "../controllers/todo-controller.js";
import createAccount from "../controllers/user-controller.js";
import createAccessToken from "../controllers/auth-controller.js";

const apiRoute = express.Router();
export const apiProtected = express.Router();

apiRoute.post("/accounts", RegisterSchema, createAccount);
apiRoute.post("/access-token", LoginSchema, createAccessToken);
apiProtected.post("/todos", createTodo);
apiProtected.put("/todos/:id", updateTodo);
apiProtected.get("/todos", getTodos);
apiProtected.delete("/todos/:id", deleteTodo);
apiProtected.patch("/todos/:id/status", toggleCompleteStatus);
apiProtected.get("/todos/:id", filterTodos);

export default apiRoute;
