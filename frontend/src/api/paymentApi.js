import axiosClient from "./axiosClient";

const paymentApi = {
  getAll: (params) => axiosClient.get("/payments", { params }),
};

export default paymentApi;
