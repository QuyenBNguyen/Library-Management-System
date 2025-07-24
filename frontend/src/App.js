// File: frontend/src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import các component và trang

import Layout from "./components/Layout";
import HomePage from "./pages/Member/HomePage";
import BookListPage from "./pages/Member/BookListPage";
import BookDetailPage from "./pages/Member/BookDetailPage"; // IMPORT TRANG MỚI

import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/Member/ProfilePage";
import ChangePasswordPage from "./pages/Member/ChangePasswordPage";
import BorrowHistoryPage from "./pages/BorrowHistoryPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PaymentSuccess from "./pages/Member/PaymentSuccess";
import PaymentFailure from "./pages/Member/PaymentFailure";
import BorrowListPage from "./pages/Member/BorrowListPage";
import BorrowSessionDetailPage from "./pages/BorrowSessionDetailPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          }/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/borrow-history/:sessionId" element={<BorrowSessionDetailPage />} />
        <Route path="/catalog" element={
            <Layout>
              <BookListPage />
            </Layout>
          }
        />

       
        <Route
          path="/payments/vnpay_return"
          element={
            <Layout>
              <PaymentSuccess />
            </Layout>
          }
        />
        
        <Route
          path="/payments/failure"
          element={
            <Layout>
              <PaymentFailure />
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
              <BorrowListPage />
            </Layout>
          }
        />
      </Routes>
      

    </BrowserRouter>
  );
}

export default App;
