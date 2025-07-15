// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các component và trang
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage'; // IMPORT TRANG MỚI

// Trang giả cho các link chưa làm
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '4rem', textAlign: 'center', color: '#f5e6c9' }}>
    <h1>{title}</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/catalog" element={<Layout><BookListPage /></Layout>} />
        
        {/* THÊM ROUTE ĐỘNG CHO TRANG CHI TIẾT SÁCH */}
        <Route path="/books/:bookId" element={<Layout><BookDetailPage /></Layout>} />

        {/* Các route còn lại trên menu */}
        <Route path="/profile" element={<Layout><PlaceholderPage title="User Profile" /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;