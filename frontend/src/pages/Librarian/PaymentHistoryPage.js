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
      setPayments(res.data);
      setPagination({ page: res.data.page, totalPages: res.data.totalPages });
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-4">
      <h1>Payment History</h1>
      <div className="">
        <div>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-12">
            <div className="col-span-2">Transaction Id</div>
            <div className="col-span-2">User</div>
            <div className="col-span-4">Loans</div>
            <div className="">Method</div>
            <div className="">Amount</div>
            <div className="">Status</div>
            <div className="">Paid At</div>
          </div>
          {payments.map((payment) => (
            <div key={payment.id} className="grid grid-cols-12">
              <div className="col-span-2">{payment._id}</div>
              <div className="col-span-2">{payment.user.name}</div>
              <div className="col-span-4">Loans</div>
              <div className="">{payment.method}</div>
              <div className="">{payment.amount}</div>
              <div className="">{payment.status}</div>
              <div className="">
                {payment.paidAt && dayjs(payment.paidAt).format("DD/MM/YYYY")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
