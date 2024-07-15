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

//login api
export const login = async (data) => {
  return axios.post(LOGIN, data);
};
//register api
export const register = async (data) => {
  return axios.post(REGISTER, data);
};
//Create Todo Api
export const createTodoApi = async (data) => {
  let token = getToken();
  return axios.post(CREATE_TODO, data, {
    headers: {
      auth: token,
    },
  });
};
//Update Todo Api
export const updateTodoApi = async (data) => {
  const token = getToken();

  try {
    const response = await axios.put(EDIT_TODO, data, {
      headers: {
        auth: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Get todos API
export const getTodoListApi = async (data) => {
  let token = getToken();
  return axios.get(TODO_LIST, {
    headers: {
      auth: token,
    },
  });
};
//Delete Todo Api
export const deleteTodoApi = async (data) => {
  let token = getToken();
  return axios.delete(DELETE_TODO, {
    headers: {
      auth: token,
    },
    data:data,
  });
};

//markTodos
export const markTodoApi = async (data) => {
  let token = getToken();
  return axios.patch(MARK_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

//FilterTodos by id
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
    throw error;
  }
};


//Get token.
export function getToken() {
  let user = localStorage.getItem("user");
  if (!user) return;
  const userObj = JSON.parse(user);
  return userObj.token;
}
