import axios from 'axios';

const API_URL = 'http://localhost:3001';

type Task = {
  id: string;
  name: string;
  isCompleted: boolean;
};

const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

const addTask = async (task: Task) => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

const deleteTask = async (id: string) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`);
  return response.data;
};

const updateTask = async (task: Task) => {
  const response = await axios.put(`${API_URL}/tasks/${task.id}`, task);
  return response.data;
};

export default {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
};
