import axiosClient from "./axiosClient";

const bookApi = {
  getAll: (params) => axiosClient.get("/books", { params }),
  getById: (id) => axiosClient.get(`/books/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return axiosClient.post("/books", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return axiosClient.post("/books", data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return axiosClient.put(`/books/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return axiosClient.put(`/books/${id}`, data);
  },
  delete: (id) => axiosClient.delete(`/books/${id}`),
};

export default bookApi;
