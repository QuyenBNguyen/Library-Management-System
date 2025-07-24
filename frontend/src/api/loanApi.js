import axiosClient from "./axiosClient";

const borrowApi = {
  getAll: (params) => axiosClient.get("/borrow/my-books", { params }),
  getById: (id) => axiosClient.get(`/borrow/book/${id}`),
  create: (data) => axiosClient.post("/borrow/book", data),
  update: (id, data) => axiosClient.put(`/borrow/book/${id}`, data),
  delete: (id) => axiosClient.delete(`/borrow/book/${id}`),
  getBorrowing: () => axiosClient.get("/borrow/my-borrowing"),
  getReserving: () => axiosClient.get("/borrow/my-reserving"),
  getOverdue: () => axiosClient.get("/borrow/my-overdue"),
};

export default borrowApi;
