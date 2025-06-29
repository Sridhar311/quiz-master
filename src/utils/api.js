import axios from 'axios';

const API_URL = 'https://quiz-master-r7lf.onrender.com/api';

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
}

export async function register(name, email, password) {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return res.data;
}

export function getToken() {
  return localStorage.getItem('token');
}

// Categories
export async function getCategories() {
  const token = getToken();
  const res = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function addCategory(name) {
  const token = getToken();
  const res = await axios.post(`${API_URL}/categories`, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function editCategory(id, name) {
  const token = getToken();
  const res = await axios.put(`${API_URL}/categories/${id}`, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function deleteCategory(id) {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Questions
export async function getQuestions() {
  const token = getToken();
  const res = await axios.get(`${API_URL}/questions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function addQuestion(data) {
  const token = getToken();
  const res = await axios.post(`${API_URL}/questions`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function editQuestion(id, data) {
  const token = getToken();
  const res = await axios.put(`${API_URL}/questions/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function deleteQuestion(id) {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Quiz Results
export async function saveQuizResult(result) {
  const token = getToken();
  console.log(token);
  const res = await axios.post(`${API_URL}/results`, result, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function getQuizResults() {
  const token = getToken();
  const res = await axios.get(`${API_URL}/results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function loginWithGoogle(idToken) {
  const res = await axios.post('https://quiz-master-r7lf.onrender.com/api/auth/google', { idToken });
  localStorage.setItem('token', res.data.token);
  return res.data.user;
}

// User Management (Admin)
export async function getUsers() {
  const token = getToken();
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
export async function deleteUser(id) {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
} 