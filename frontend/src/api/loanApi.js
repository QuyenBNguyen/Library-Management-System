import axiosClient from "./axiosClient";

const loanApi = {
  getAll: (params) => axiosClient.get("/loans", { params }),
  create: (data) => axiosClient.post("/loans", data),
  update: (id, data) => axiosClient.put(`/loans/${id}`, data),
  delete: (id) => axiosClient.delete(`/loans/${id}`),
};

export default loanApi;
