// File: frontend/src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import HeroSection from '../../components/HeroSection';
import FeaturedBooks from '../../components/FeaturedBooks';
import AdvancedSearch from '../../components/AdvancedSearch';
import bookApi from '../../api/bookApi';


const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await bookApi.getAll();
        // Defensive: ensure books is always an array
        setBooks(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <HeroSection />
      {loading ? (
        <div style={{ textAlign: 'center', color: '#543512', margin: '2rem' }}>Loading books...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', margin: '2rem' }}>{error}</div>
      ) : (
        <FeaturedBooks books={books} />
      )}
      <AdvancedSearch />
    </div>
  );
};

export default HomePage;