import { validationResult } from "express-validator";
import Todo from "../models/todo.js";
import User from "../models/user.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

export const createTodo = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "Todo is required",
        error.mapped()
      )
    );
  }

  try {
    const result = await Todo.create({
      userId: req.userId,
      title: req.body.title,
      desc: req.body.desc,
      type: req.body.type,
      dueDate: req.body.dueDate
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { todos: result },
        }
      );
      return res.json(
        jsonGenerate(StatusCode.SUCCESS, "Todo created Succssfully", result)
      );
    }
  } catch (error) {
    return res.json(
      jsonGenerate(
        StatusCode.UNPROCESSABLE_ENTITY,
        "Something went wrong",
        error
      )
    );
  }
};
//Edit todo
export const EditTodo = async (req, res) => {
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

  try {
    const { todo_id, title, desc, type, dueDate } = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todo_id, userId: req.userId },
      { title, desc, type, dueDate },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Todo not found"));
    }

    return res.json(
      jsonGenerate(StatusCode.SUCCESS, "Todo updated successfully", updatedTodo)
    );
  } catch (error) {
    console.error("EditTodo error:", error);
    return res
      .status(500)
      .json(jsonGenerate(StatusCode.DATABASE_ERROR, "Server error"));
  }
};

export const filterTodos = async (req, res) => {
  try {
    const { filter, status } = req.query;
    const userId = req.userId;
    let todos;
    
    if (filter === "overdue") {
      todos = await Todo.find({ userId, dueDate: { $lt: new Date() }, isCompleted: false });
    } else if (filter === "status") {
      todos = await Todo.find({ userId, isCompleted: status === "done" });
    } else {
      todos = await Todo.find({ userId , isCompleted: false });
    }

    res.status(200).json({ status: 200, data: { todos } });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

