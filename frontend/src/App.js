// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các component của mình
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Định nghĩa route cho trang chủ */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />

        {/* Mình có thể tạo sẵn route cho trang sách ở đây */}
        {/* <Route path="/books" element={<Layout><BookListPage /></Layout>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;