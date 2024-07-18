import React, { useState } from "react";
import { toast } from "react-toastify";
import { createTodoApi } from "../../services/api";

function AddTodo({ setRefreshList }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleTodoSubmit = async () => {
    if (!title || !desc || !type || !dueDate) {
      toast("All fields are required", { autoClose: 1000 });
      return;
    }
    const result = await createTodoApi({ title, desc, type, dueDate });
    if (result.status === 200 && result.data.status === 200) {
      toast("Todo Added", { autoClose: 1000 });
      setRefreshList(new Date());
      closeModal();
    } else {
      toast(result.data.message);
    }
  };

  const closeModal = () => {
    document.getElementById("closeModalButton").click();
  };

  return (
    <div className="modal mt-5 " id="exampleModal">
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-light">
          <div className="modal-header">
            <div className="modal-title">Add new Todo</div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="close"
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="form-control mb-3"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
              ></textarea>
              <select
                className="form-control mb-3"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Official">Official</option>
                <option value="Personal">Personal</option>
                <option value="Hobby">Hobby</option>
              </select>
              <input
                type="date"
                className="form-control mb-3"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              id="closeModalButton"
              className="btn btn-secondary"
              onClick={() => {
                setTitle("");
                setDesc("");
                setType("");
                setDueDate("");
              }}
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleTodoSubmit}
            >
              Save Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTodo;
