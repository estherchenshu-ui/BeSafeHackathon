import axios from 'axios';

const apiUrl = import.meta.env.VITE_SERVER_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;