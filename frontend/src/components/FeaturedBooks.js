import React, { useState } from 'react';
import Slider from 'react-slick';
import BookCard from './BookCard';
import { allBooks } from '../data/mockData';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Lấy 6 cuốn sách đầu tiên làm sách nổi bật
const featured = allBooks.slice(0, 6);

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
    return ( <div style={finalArrowStyle} onClick={onClick} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 174, 0, 1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 174, 0, 0.7)'; }}><span style={{ color: '#543512', fontSize: '26px', lineHeight: '0', fontWeight: 'bold' }}>{arrowChar}</span></div> );
}

const FeaturedBooks = () => {
  const [isHovering, setIsHovering] = useState(false);
  const settings = {
    dots: false, infinite: true, speed: 500, slidesToShow: 4, slidesToScroll: 1,
    nextArrow: <Arrow direction="next" isVisible={isHovering} />,
    prevArrow: <Arrow direction="prev" isVisible={isHovering} />,
    responsive: [ { breakpoint: 1400, settings: { slidesToShow: 3 } }, { breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 700, settings: { slidesToShow: 1 } } ]
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
      <div style={styles.sliderContainer} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <Slider {...settings}>
          {featured.map((book) => (
            <div key={book.id} style={styles.cardWrapper}>
                {/* Đảm bảo truyền tất cả thông tin sách, bao gồm cả 'id' */}
                <BookCard {...book} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FeaturedBooks;