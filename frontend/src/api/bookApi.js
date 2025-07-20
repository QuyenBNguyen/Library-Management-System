import axiosClient from "./axiosClient";

const bookApi = {
  getAll: (params) => axiosClient.get("/books", { params }),
  getById: (id) => axiosClient.get(`/books/${id}`),
  create: (data) => axiosClient.post("/books", data),
  update: (id, data) => axiosClient.put(`/books/${id}`, data),
  delete: (id) => axiosClient.delete(`/books/${id}`),
};

export default bookApi;
