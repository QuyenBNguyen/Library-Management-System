import React, { useState } from 'react';
import Slider from 'react-slick';
import BookCard from './BookCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

const FeaturedBooks = ({ books }) => {
  const [isHovering, setIsHovering] = useState(false);
  // Defensive: ensure books is always an array
  const featured = Array.isArray(books) ? books.slice(0, 6) : [];
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="next" isVisible={isHovering} />,
    prevArrow: <Arrow direction="prev" isVisible={isHovering} />,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 700, settings: { slidesToShow: 1 } }
    ]
  };

  const styles = {
    sectionWrapper: { backgroundColor: '#83552d', borderRadius: '16px', padding: '3rem', margin: '4rem auto', maxWidth: '1300px', border: '1px solid #543512' },
    title: { textAlign: 'center', fontSize: '2.5rem', fontWeight: '700', color: '#f5e6c9', marginBottom: '2.5rem' },
    sliderContainer: { position: 'relative', maxWidth: '1200px', margin: '0 auto' },
    cardWrapper: { padding: '10px 15px' },
  };

  return (
    <div style={styles.sectionWrapper}>
      <h2 style={styles.title}>From the Shelves</h2>
      {featured.length === 0 ? (
        <div style={{ color: '#f5e6c9', textAlign: 'center', padding: '2rem' }}>No books available.</div>
      ) : (
        <div style={styles.sliderContainer} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <Slider {...settings}>
            {featured.map((book) => (
              <div key={book._id || book.id} style={styles.cardWrapper}>
                <BookCard {...book} />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <button style={{ marginTop: '2rem', padding: '1rem 2rem', backgroundColor: '#543512', color: '#f5e6c9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => {
        navigate('/catalog');
      }}>View All Books</button>
    </div>
  );
};

const Arrow = ({ onClick, direction, isVisible }) => {
  const arrowChar = direction === 'next' ? '→' : '←';
  const arrowBaseStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255, 174, 0, 0.7)',
    borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', zIndex: 2, display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s',
    opacity: isVisible ? 1 : 0,
  };
  const finalArrowStyle = direction === 'next' ? { ...arrowBaseStyle, right: '-55px' } : { ...arrowBaseStyle, left: '-55px' };
  return (
    <div style={finalArrowStyle} onClick={onClick} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 174, 0, 1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 174, 0, 0.7)'; }}>
      <span style={{ color: '#543512', fontSize: '26px', lineHeight: '0', fontWeight: 'bold' }}>{arrowChar}</span>
    </div>
  );
};

export default FeaturedBooks;