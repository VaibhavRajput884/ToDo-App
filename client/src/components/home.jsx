import React, { useEffect, useState } from "react";
import Header from "./partials/header";
import Todo from "./partials/todo";
import AddTodo from "./partials/add-todo";
import { getTodoListApi, filterTodosApi, getToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function Home() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [todos, setTodos] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!getToken()) {
      navigate("/access-token");
    } else {
      fetchTodoList();
    }
  }, [refreshList, filter]);

  async function fetchTodoList() {
    try {
      let result;
      if (filter) {
        const [filterType, status] = filter.split("&status=");
        result = await filterTodosApi(filterType, status);
      } else {
        result = await getTodoListApi();
      }

      if (result.status === 200 && result.data.status === 200) {
        setTodos(result.data.data.todos.reverse());
      } else {
        console.error("Error fetching todos:", result);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  const handleFilterChange = async (event) => {
    setFilter(event.target.value);
    await fetchTodoList();
  };

  const filteredTodos = todos.filter((todo) => {
    if (searchText === "") {
      return true;
    }
    return todo.desc.toLowerCase().includes(searchText.toLowerCase().trim());
  });

  const getFilteredAndSortedTodos = () => {
    return filteredTodos.filter((todo) => {
      if (filter === "overdue") {
        return new Date(todo.dueDate) < new Date();
      } else if (filter === "status&status=todo") {
        return todo.isCompleted === false;
      } else if (filter === "status&status=done") {
        return todo.isCompleted === true;
      } else {
        return true;
      }
    });
  };

  const filteredAndSortedTodos = getFilteredAndSortedTodos();

  const getPersonalizedMessage = () => {
    if (filteredAndSortedTodos.length === 0) {
      return "No tasks found for the selected filter.";
    }

    switch (filter) {
      case "overdue":
        return "These tasks are overdue.";
      case "status&status=todo":
        return "Here are your pending tasks.";
      case "status&status=done":
        return "Here are completed tasks.";
      default:
        return "Here are all your tasks.";
    }
  };

  return (
    <div>
      <Header searchText={searchText} setSearchText={setSearchText} />
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-md-center mt-4">
          <div className="col-md-12 mb-3">
            <select
              onChange={handleFilterChange}
              value={filter}
              className="form-select"
            >
              <option value="">All Todos</option>
              <option value="overdue">Overdue</option>
              <option value="status&status=todo">To Do</option>
              <option value="status&status=done">Done</option>
            </select>
          </div>
          <div className="col-md-11 mb-3">
            <h4>{getPersonalizedMessage()}</h4>
          </div>
          {filteredAndSortedTodos.length > 0 && (
            <div className="row justify-content-md-center mt-4">
              {filteredAndSortedTodos.map((todo) => (
                <Todo
                  todo={todo}
                  key={todo._id}
                  setRefreshList={setRefreshList}
                />
              ))}
            </div>
          )}
          {filteredAndSortedTodos.length === 0 && (
            <div className="notFoundTodo">No todos</div>
          )}
        </div>
      </div>
      <div
        className=""
        style={{ position: "fixed", right: 50, bottom: 50, zIndex: 1030 }}
      >
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn-outline-light"
        >
          Add Todo
        </button>
      </div>
      <AddTodo setRefreshList={setRefreshList} />
    </div>
  );
}

export default Home;
