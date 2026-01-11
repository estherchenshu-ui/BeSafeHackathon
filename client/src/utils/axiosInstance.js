import axios from 'axios';

// שימוש בברירת מחדל קשיחה כדי למנוע תקלות עם משתני סביבה במצגת
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;