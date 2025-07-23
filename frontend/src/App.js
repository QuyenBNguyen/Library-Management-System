// File: frontend/src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import các component và trang

import Layout from "./components/Layout";
import LibrarianLayout from "./layouts/LibrarianLayout";
import HomePage from "./pages/HomePage";
import BookListPage from "./pages/BookListPage";
import BookDetailPage from "./pages/BookDetailPage"; // IMPORT TRANG MỚI
import BookManagementPage from "./pages/Librarian/BookManagementPage";
import Payment from "./pages/Payment";
import PaymentHistory from "./pages/PaymentHistory";
import VNPayReturn from "./pages/VNPayReturn";
import LibrarianDashboardPage from "./pages/Librarian/LibrarianDashboardPage";
import LoanManagmentPage from "./pages/Librarian/LoanManagmentPage";
import PaymentHistoryPage from "./pages/Librarian/PaymentHistoryPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import BorrowHistoryPage from "./pages/BorrowHistoryPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

import VerifyOtpPage from "./pages/EmailVerifiedPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Trang giả cho các link chưa làm
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: "4rem", textAlign: "center", color: "#f5e6c9" }}>
    <h1>{title}</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route
          path="/catalog"
          element={
            <Layout>
              <BookListPage />
            </Layout>
          }
        />

        <Route path="/librarian" element={<LibrarianLayout />}>
          <Route index element={<LibrarianDashboardPage />} />
          <Route path="books" element={<BookManagementPage />} />
          <Route path="loans" element={<LoanManagmentPage />} />

          <Route path="payment-history" element={<PaymentHistoryPage />} />
        </Route>

        <Route
          path="/payments"
          element={
            <Layout>
              <Payment />
            </Layout>
          }
        />

        <Route
          path="/payment/vnpay-return"
          element={
            <Layout>
              <VNPayReturn />
            </Layout>
          }
        />
        {/* THÊM ROUTE ĐỘNG CHO TRANG CHI TIẾT SÁCH */}
        <Route
          path="/books/:bookId"
          element={
            <Layout>
              <BookDetailPage />
            </Layout>
          }
        />

        {/* Các route còn lại trên menu */}
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
        <Route
          path="/change-password"
          element={
            <Layout>
              <ChangePasswordPage />
            </Layout>
          }
        />
        <Route
          path="/borrow-history"
          element={
            <Layout>
              <BorrowHistoryPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
