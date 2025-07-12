// File: frontend/src/pages/HomePage.js

import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedBooks from '../components/FeaturedBooks'; // Sử dụng lại component này
import AdvancedSearch from '../components/AdvancedSearch'; // Sử dụng lại component này

const HomePage = () => {
  return (
    <div>
      <HeroSection />

      {/* Thay đổi nhỏ style cho phần nền của các section sau */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1px 0'}}>
        <FeaturedBooks />
      </div>

      <div style={{ backgroundColor: '#F4F6F8', padding: '1px 0' }}>
         <AdvancedSearch />
      </div>
    </div>
  );
};

export default HomePage;