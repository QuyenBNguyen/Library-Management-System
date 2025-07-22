import React from "react";

const PaymentFailurePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Thanh toán thất bại
      </h1>
      <p className="text-lg text-gray-700">
        Giao dịch của bạn không được xử lý thành công.
      </p>
      <a
        href="/"
        className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Quay lại trang chủ
      </a>
    </div>
  );
};

export default PaymentFailurePage;
