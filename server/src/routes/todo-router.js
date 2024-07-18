import express from "express";
import {
  createTodo,
  deleteTodo,
  filterTodos,
  toggleCompleteStatus,
  updateTodo,
  getTodos,
} from "../controllers/todo-controller.js";
import ensureAccess from "../middleware/account-auth.js";

const router = express.Router();

router.post("/", ensureAccess, createTodo);
router.put("/:id", ensureAccess, updateTodo);
router.get("/", ensureAccess, getTodos);
router.delete("/:id", ensureAccess, deleteTodo);
router.patch("/:id/status", ensureAccess, toggleCompleteStatus);
router.get("/:id", ensureAccess, filterTodos);

export default router;
