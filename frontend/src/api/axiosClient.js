import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2JkNjdmODQ0YmRkMTA1MGE2MzQ2MyIsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE3NTMwMDAwMjcsImV4cCI6MTc1MzAwNzIyN30.CWxo9itWv_QT2zdl6dkeJT8mpSxMm0SA7KHOGmeR7VY";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
