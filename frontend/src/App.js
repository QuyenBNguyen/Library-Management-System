// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các component và trang
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage'; // Đảm bảo dòng import này đúng

// Tạo sẵn một vài trang giả để các link trên menu không bị lỗi
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '4rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        
        {/* Route cho trang Danh sách sách */}
        <Route path="/catalog" element={<Layout><BookListPage /></Layout>} />

        <Route path="/events" element={<Layout><PlaceholderPage title="Events" /></Layout>} />
        <Route path="/about" element={<Layout><PlaceholderPage title="About Us" /></Layout>} />
        <Route path="/profile" element={<Layout><PlaceholderPage title="User Profile" /></Layout>} />
        
        {/* Mình sẽ làm trang chi tiết sách sau */}
        {/* <Route path="/books/:bookId" element={<Layout><BookDetailPage /></Layout>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;