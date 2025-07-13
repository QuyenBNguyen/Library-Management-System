import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import BorrowHistoryPage from "./pages/BorrowHistoryPage";
import BooksPage from "./pages/BooksPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route mặc định - hiển thị dashboard */}
        <Route path="/" element={<DashboardPage />} />
        
        {/* Route cho trang dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Route cho trang profile */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Route cho trang borrow history */}
        <Route path="/borrow-history" element={<BorrowHistoryPage />} />
        
        {/* Route cho trang books */}
        <Route path="/books" element={<BooksPage />} />
        
        {/* Route fallback - chuyển hướng về dashboard cho các URL không tồn tại */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
