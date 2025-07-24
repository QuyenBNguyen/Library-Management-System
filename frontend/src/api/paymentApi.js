import axiosClient from "./axiosClient";

const paymentApi = {
  getAll: (params) => axiosClient.get("/payments", { params }),
  createPaymentUrl: (borrowBookIds) => axiosClient.post("/payments", { borrowBookIds }),
};

export default paymentApi;
