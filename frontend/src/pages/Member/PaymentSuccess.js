import { useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const status = params.get("status");
  const message = params.get("message");
  const amount = params.get("amount");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Kết quả thanh toán</h1>
      {status === "success" && (
        <p className="text-green-600">
          Thanh toán thành công! Số tiền: {amount}
        </p>
      )}
      {status === "failed" && (
        <p className="text-red-600">Thanh toán thất bại.</p>
      )}
      {status === "error" && <p className="text-red-600">Lỗi: {message}</p>}
      {status === "exists" && (
        <p className="text-yellow-600">Giao dịch này đã được xử lý trước đó.</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
