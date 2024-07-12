import axios from "axios";

import {
  CREATE_TODO,
  DELETE_TODO,
  EDIT_TODO,
  FILTER_TODOS,
  LOGIN,
  MARK_TODO,
  REGISTER,
  TODO_LIST,
} from "./api-constants";

export const login = async (data) => {
  return axios.post(LOGIN, data);
};
//registe api
export const register = async (data) => {
  return axios.post(REGISTER, data);
};
export const createTodoApi = async (data) => {
  let token = getToken();
  console.log(token, "token");
  return axios.post(CREATE_TODO, data, {
    headers: {
      auth: token,
    },
  });
};
export const updateTodoApi = async (data) => {
  const token = getToken();

  try {
    const response = await axios.post(EDIT_TODO, data, {
      headers: {
        auth: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const getTodoListApi = async (data) => {
  let token = getToken();
  console.log(token, "token");
  return axios.get(TODO_LIST, {
    headers: {
      auth: token,
    },
  });
};

export const deleteTodoApi = async (data) => {
  let token = getToken();
  console.log(token, "token");
  return axios.post(DELETE_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export const markTodoApi = async (data) => {
  let token = getToken();
  return axios.post(MARK_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export const filterTodosApi = async (filter, status) => {
  const token = getToken();
  try {
    const response = await axios.get(`${FILTER_TODOS}?filter=${filter}&status=${status || ""}`, {
      headers: {
        auth: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered todos:", error);
    throw error;
  }
};

export function getToken() {
  let user = localStorage.getItem("user");
  if (!user) return;
  const userObj = JSON.parse(user);
  return userObj.token;
}
