import { API_URL } from "../config";

export const LOGIN = `${API_URL}/api/access-tokens`;
export const REGISTER = `${API_URL}/api/users`;
export const CREATE_TODO = `${API_URL}/api/todos`;
export const TODO_LIST = `${API_URL}/api/todos`;
export const DELETE_TODO = `${API_URL}/api/todos/:id`;
export const MARK_TODO = `${API_URL}/api/todos/:id/status`;
export const EDIT_TODO = `${API_URL}/api/todos/:id`;
export const FILTER_TODOS = `${API_URL}/api/todos/:id`;

