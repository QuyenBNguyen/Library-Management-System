// File: frontend/src/pages/HomePage.js

import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedBooks from '../components/FeaturedBooks';
import AdvancedSearch from '../components/AdvancedSearch';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedBooks />
      <AdvancedSearch />
    </div>
  );
};

export default HomePage;