// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Chỉ import những gì mình cần
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route cho Trang chủ */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        {/* Route cho trang Danh sách sách */}
        <Route path="/catalog" element={
          <Layout>
            <BookListPage />
          </Layout>
        } />
        
        {/* Các route khác sẽ được làm sau */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;