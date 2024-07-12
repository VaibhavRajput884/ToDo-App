import React, { useState } from "react";
import moment from "moment";
import { deleteTodoApi, markTodoApi, updateTodoApi } from "../../services/api";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrashAlt,
  faCheckCircle,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./todo.css";

function Todo({ todo, setRefreshList }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [desc, setDesc] = useState(todo.desc);
  const [type, setType] = useState(todo.type);
  const [dueDate, setDueDate] = useState(
    moment(todo.dueDate).format("YYYY-MM-DD")
  );
  const [deleteClicked, setDeleteClicked] = useState(false);

  const handleDelete = async () => {
    setDeleteClicked(true);
    const result = await deleteTodoApi({ todo_id: todo._id });
    if (result.data.status === 200) {
      setRefreshList(new Date());
      toast("Deleted", { autoClose: 1000 });
    } else {
      toast("Failed to delete, please try again", { autoClose: 1000 });
    }
  };

  const handleMarkTodo = async () => {
    const result = await markTodoApi({ todo_id: todo._id });
    if (result.data.status === 200) {
      setRefreshList(new Date());
      toast(result.data.message, { autoClose: 1000 });
    } else {
      toast("Failed to mark, please try again", { autoClose: 1000 });
    }
  };

  const handleUpdateTodo = async () => {
    const updatedTodo = {
      todo_id: todo._id,
      title,
      desc,
      type,
      dueDate,
    };

    try {
      const result = await updateTodoApi(updatedTodo);
      if (result.status === 200) {
        toast.success("Todo updated successfully", { autoClose: 1000 });
        setIsEditing(false);
        setRefreshList(new Date());
      } else {
        toast.error("Failed to update todo", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo", { autoClose: 1000 });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(todo.title);
    setDesc(todo.desc);
    setType(todo.type);
    setDueDate(moment(todo.dueDate).format("YYYY-MM-DD"));
  };

  return (
    <div className={`col-sm-3 mx-3 my-2 alert bg-light ${isEditing ? "editing" : ""}`}>
      <div className="card-header">
        {todo.isCompleted ? "Completed" : "Not Complete"}
      </div>
      <div className="card-body">
        {isEditing ? (
          <>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Official">Official</option>
                <option value="Personal">Personal</option>
                <option value="Hobby">Hobby</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <h5
              className="card-title mb-3"
              style={{
                textDecoration: todo.isCompleted ? "line-through" : "none",
              }}
            >
              <strong>{todo.title}</strong>
            </h5>
            <p className="card-text mb-3">{todo.desc}</p>
            <p className="card-text mb-3">
              <strong>Type:</strong> {todo.type}
            </p>
            <p className="card-text mb-2">
              <small className="text-muted">
                Due Date: {moment(todo.dueDate).format("MM-DD-YYYY")}
              </small>
            </p>
          </>
        )}
      </div>
      <div
        className="actionButton"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!isEditing && (
          <>
            <div className="deleteButton">
              <button
                className="btn btn-link"
                onClick={handleDelete}
                style={{
                  background: "none",
                  border: "none",
                  color: deleteClicked ? "red" : "inherit",
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
            <div className="markTodo">
              <button
                className="btn btn-link"
                onClick={handleMarkTodo}
                style={{
                  background: "none",
                  border: "none",
                  color: todo.isCompleted ? "green" : "inherit",
                }}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </button>
            </div>
          </>
        )}
        {isEditing ? (
          <>
            <button className="btn btn-success" onClick={handleUpdateTodo}>
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          </>
        ) : (
          <button
            className="btn btn-link"
            onClick={() => setIsEditing(true)}
            style={{ background: "none", border: "none" }}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Todo;
