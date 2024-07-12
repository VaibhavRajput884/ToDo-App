import express from "express";
import Register from "../controllers/Register.js";
import { RegisterSchema } from "../validationSchema/Register-schema.js";
import { LoginSchema } from "../validationSchema/Login-schema.js";
import Login from "../controllers/Login.js";
import { createTodo, filterTodos, EditTodo } from "../controllers/Todo.js";
import { check } from "express-validator";
import { GetTodos } from "../controllers/Todo-list.js";
import { MarkTodo } from "../controllers/Mark-todo.js";
import { RemoveTodo } from "../controllers/Remove-todo.js";

const apiRoute = express.Router();
export const apiProtected = express.Router();

apiRoute.post("/register", RegisterSchema, Register);
apiRoute.post("/login", LoginSchema, Login);

apiProtected.post(
  "/createTodo",
  [
    check("title", "Title is required").exists(),
    check("desc", "Todo desc is required").exists(),
    check("type", "Type is required").exists(),
    check("dueDate", "Due date is required").optional(),
  ],
  createTodo
);

apiProtected.post(
  "/editTodo",
  [
    check("todo_id", "Todo id is required").exists(),
    check("title", "Title is required").optional(),
    check("desc", "Description is required").optional(),
    check("type", "Type is required").optional(),
    check("dueDate", "Due date is required").optional(),
  ],
  EditTodo
);

apiProtected.post(
  "/marktodo",
  [check("todo_id", "Todo id  is required").exists()],
  MarkTodo
);
apiProtected.post(
  "/deleteTodo",
  [check("todo_id", "Todo id  is required").exists()],
  RemoveTodo
);
apiProtected.get("/todolist", GetTodos);

apiProtected.get("/filterTodos", filterTodos);

export default apiRoute;
