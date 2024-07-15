import { validationResult } from "express-validator";
import Todo from "../models/todo-model.js";
import User from "../models/user-model.js";
import { StatusCode } from "../utils/constants.js";
import { jsonGenerate } from "../utils/helpers.js";

//CreateTodo
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
      dueDate: req.body.dueDate,
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
export const updateTodo = async (req, res) => {
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
    return res
      .status(500)
      .json(jsonGenerate(StatusCode.DATABASE_ERROR, "Server error"));
  }
};

//Delete Todo
export const deleteTodo = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "todo id is required",
        error.mapped()
      )
    );
  }

  try {
    const result = await Todo.findOneAndDelete({
      userId: req.userId,
      _id: req.body.todo_id,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { todos: req.body.todo_id } }
      );

      return res.json(jsonGenerate(StatusCode.SUCCESS, "Todo deleted", null));
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not delete", null)
    );
  }
};

export const toggleCompleteStatus = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.json(
      jsonGenerate(
        StatusCode.VALIDATION_ERROR,
        "todo id is requied",
        error.mapped()
      )
    );
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
      return res.json(jsonGenerate(StatusCode.SUCCESS, "Updated", todo));
    }
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not update", null)
    );
  }
};

//Get all todos
export const getTodos = async (req, res) => {
  try {
    const list = await User.findById(req.userId)
      .select("-password")
      .populate("todos")
      .exec();

    return res.json(jsonGenerate(StatusCode.SUCCESS, "All todo list", list));
  } catch (error) {
    return res.json(
      jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Error", error)
    );
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
