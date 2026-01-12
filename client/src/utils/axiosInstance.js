import axios from 'axios';

const axiosInstance = axios.create({
  // הוספנו את /comments לכתובת הבסיס
  baseURL: 'http://localhost:5000/api/comments', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;