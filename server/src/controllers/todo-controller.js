import { validationResult } from "express-validator";
import Todo from "../models/todo-model.js";
import User from "../models/user-model.js";
import { jsonGenerate } from "../utils/helpers.js";

//CreateTodo
export const createTodo = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: error.array(),
    });
  }
  try {
    const result = await Todo.create({
      userId: req.userId,
      title: req.body.title,
      desc: req.body.desc,
      type: req.body.type,
      dueDate: req.body.dueDate,
    });
    if (result) {
      await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: { todos: result },
        }
      );
      return res.json(jsonGenerate(200, result));
    }
  } catch (error) {
    return res.status(422).json(jsonGenerate(422, error));
  }
};

//Edit todo
export const updateTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { todo_id, title, desc, type, dueDate } = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todo_id, userId: req.userId },
      { title, desc, type, dueDate },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json(jsonGenerate(422));
    }

    return res.json(jsonGenerate(200, updatedTodo));
  } catch (error) {
    return res.status(500).json(jsonGenerate(500));
  }
};

//Delete Todo
export const deleteTodo = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: error.array(),
    });
  }

  try {
    const result = await Todo.findOneAndDelete({
      userId: req.userId,
      _id: req.body.todo_id,
    });

    if (result) {
      await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { todos: req.body.todo_id } }
      );

      return res.json(jsonGenerate(200, null));
    }
  } catch (error) {
    return res.json(jsonGenerate(422, "Could not delete", null));
  }
};

export const toggleCompleteStatus = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json(jsonGenerate(400, error.mapped()));
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.body.todo_id,
        userId: req.userId,
      },
      [
        {
          $set: {
            isCompleted: {
              $eq: [false, "$isCompleted"],
            },
          },
        },
      ],
      { new: true }
    );

    if (todo) {
      return res.json(jsonGenerate(200, todo));
    }
  } catch (error) {
    return res.status(422).json(jsonGenerate(422, error));
  }
};

//Get all todos
export const getTodos = async (req, res) => {
  try {
    const list = await User.findById(req.userId)
      .select("-password")
      .populate("todos")
      .exec();

    return res.json(jsonGenerate(200, "All todo list", list));
  } catch (error) {
    return res
      .status(422)
      .json(jsonGenerate(422, "Error fetching todos", error));
  }
};

//Filter Todos
export const filterTodos = async (req, res) => {
  try {
    const { filter, status } = req.query;
    const userId = req.userId;
    let todos;
    // Filter based on query parameters
    if (filter === "overdue") {
      todos = await Todo.find({
        userId,
        dueDate: { $lt: new Date() },
        isCompleted: false,
      });
    } else if (filter === "status") {
      todos = await Todo.find({ userId, isCompleted: status === "done" });
    } else {
      todos = await Todo.find({ userId, isCompleted: false });
    }

    res.status(200).json({ status: 200, data: { todos } });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
