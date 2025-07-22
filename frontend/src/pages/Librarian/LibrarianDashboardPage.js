import React, { useEffect, useState } from "react";
import { BookOpen, Users, ClipboardList, CreditCard } from "lucide-react"; // Bạn cần cài lucide-react hoặc dùng icon khác
import axiosClient from "../../api/axiosClient";

const LibrarianDashboardPage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalLoans: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get("/dashboard");
        console.log("res.data", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Active Loans",
      value: stats.totalLoans,
      icon: <ClipboardList className="w-6 h-6 text-orange-600" />,
    },
    {
      title: "Payments",
      value: stats.totalPayments,
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Librarian Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-4 flex items-center gap-4 border"
          >
            <div className="bg-gray-100 p-2 rounded-full">{card.icon}</div>
            <div>
              <div className="text-gray-600 text-sm">{card.title}</div>
              <div className="text-xl font-bold">{card.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibrarianDashboardPage;
