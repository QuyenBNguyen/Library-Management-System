import React, { useEffect, useState } from "react";
import paymentApi from "../../api/paymentApi";
import dayjs from "dayjs";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getAll({
        ...filters,
        page: pagination.page,
        limit: 8,
      });
      console.log("res.data", res.data);
      setPayments(res.data.data);
      setPagination({
        page: Number(res.data.page),
        totalPages: Number(res.data.totalPages),
      });
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters, pagination.page]);

  return (
    <div className="p-4">
      <h1>Payment History</h1>
      <div className="">
        <div>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-12">
            <div className="col-span-2 py-3 px-4 border">Transaction Id</div>
            <div className="col-span-2 py-3 px-4 border">User</div>
            <div className="col-span-4 py-3 px-4 border">Loans</div>
            <div className="py-3 px-4 border">Method</div>
            <div className="py-3 px-4 border">Amount</div>
            <div className="py-3 px-4 border">Status</div>
            <div className="py-3 px-4 border">Paid At</div>
          </div>
          {payments.map((payment) => (
            <div key={payment._id} className="grid grid-cols-12">
              <div className="col-span-2 py-2 px-4 border">{payment._id}</div>
              <div className="col-span-2 py-2 px-4 border">
                {payment.user.name}
              </div>
              <div className="col-span-4 py-2 px-4 border">Loans</div>
              <div className="py-2 px-4 border">{payment.method}</div>
              <div className="py-2 px-4 border">{payment.amount}</div>
              <div className="py-2 px-4 border">{payment.status}</div>
              <div className="py-2 px-4 border">
                {payment.paidAt && dayjs(payment.paidAt).format("DD/MM/YYYY")}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="px-4 py-2 bg-gray-200 rounded"
          >
            ◀️ Prev
          </button>
          <span className="px-4 py-2">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next ▶️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
