import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import loanApi from "../../api/loanApi";

const LoanManagmentPage = () => {
  const [loans, setLoans] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loanApi.getAll({
        ...filters,
        page: pagination.page,
        limit: 8,
      });

      setLoans(res.data);

      setPagination({ page: res.data.page, totalPages: res.data.totalPages });
    } catch (err) {
      console.error("Failed to fetch loans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="p-4">
      <h1>Loan Managment</h1>
      <div className="">
        <div className="flex justify-between items-center">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-12">
            <div className="col-span-2 py-3 px-4 border">Loan Id</div>
            <div className="col-span-2 py-3 px-4 border">Book</div>
            <div className="col-span-2 py-3 px-4 border">User</div>
            <div className="py-3 px-4 border">Borrow Date</div>
            <div className="py-3 px-4 border">Due Date</div>
            <div className="py-3 px-4 border">Return Date</div>
            <div className="py-3 px-4 border">Status</div>
            <div className="py-3 px-4 border">Overdue Fee</div>
            <div className="py-3 px-4 border">Is Paid</div>
          </div>
          {loans.map((loan) => (
            <div key={loan._id} className="grid grid-cols-12">
              <div className="col-span-2 py-2 px-4 border">{loan._id}</div>
              <div className="col-span-2 py-2 px-4 border">
                {loan.book.title}
              </div>
              <div className="col-span-2 py-2 px-4 border">
                {loan.user.email}
              </div>
              <div className=" py-2 px-4 border">
                {dayjs(loan.borrowDate).format("DD/MM/YYYY")}
              </div>
              <div className=" py-2 px-4 border">
                {dayjs(loan.dueDate).format("DD/MM/YYYY")}
              </div>
              <div className=" py-2 px-4 border">
                {loan.returnDate && dayjs(loan.returnDate).format("DD/MM/YYYY")}
              </div>
              <div className=" py-2 px-4 border">{loan.status}</div>
              <div className=" py-2 px-4 border">{loan.overdueFee}</div>
              <div className=" py-2 px-4 border">
                {loan.isPaid ? "Paid" : "Not Paid"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanManagmentPage;
