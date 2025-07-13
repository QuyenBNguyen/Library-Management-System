// File: frontend/src/components/FeaturedBooks.js

import React, { useState } from 'react';
import Slider from 'react-slick';
import BookCard from './BookCard';
import { Link } from 'react-router-dom';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Dữ liệu sách tiếng Việt của cậu, có thêm giá tiền
const books = [
  { id: 'dac-nhan-tam', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', imageUrl: 'https://i.pinimg.com/1200x/1c/22/df/1c22df7132ad8f1358688b23831e9eaf.jpg', price: 89000 },
  { id: 'nha-gia-kim', title: 'Nhà Giả Kim', author: 'Paulo Coelho', imageUrl: 'https://i.pinimg.com/736x/d6/fe/7a/d6fe7a345fae0de4a2d9e86d1a181c62.jpg', price: 79000 },
  { id: 'hoang-tu-be', title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', imageUrl: 'https://i.pinimg.com/736x/73/fe/f2/73fef2d17b9f311e713bee4bcba584d7.jpg', price: 59000 },
  { id: 'khong-gia-dinh', title: 'Không Gia Đình', author: 'Hector Malot', imageUrl: 'https://i.pinimg.com/1200x/42/66/87/42668721450f1854c0634e6a765ee821.jpg', price: 115000 },
  { id: 'ca-phe-cung-tony', title: 'Cà phê cùng Tony', author: 'Tony Buổi Sáng', imageUrl: 'https://i.pinimg.com/1200x/13/4c/f6/134cf6f5c279eaf36e0cd380116d89ff.jpg', price: 99000 },
  { id: 'ty-phu-ban-giay', title: 'Tỷ phú bán giày', author: 'Tony Hsieh', imageUrl: 'https://i.pinimg.com/1200x/a8/f1/30/a8f13062a2634ee4eafbc5492d0f0f16.jpg', price: 129000 },
];

// Mũi tên điều hướng với màu vintage
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
        <div style={finalArrowStyle} onClick={onClick}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 174, 0, 1)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 174, 0, 0.7)'; }}>
            <span style={{ color: '#543512', fontSize: '26px', lineHeight: '0', fontWeight: 'bold' }}>{arrowChar}</span>
        </div>
    );
}

// Component chính
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
    sliderContainer: { position: 'relative', maxWidth: '1120px', margin: '0 auto' },
    cardWrapper: { padding: '10px 8px' },
    cardLink: { textDecoration: 'none' },
  };

  return (
    <div style={styles.sectionWrapper}>
      <h2 style={styles.title}>From the Shelves</h2>
      <div style={styles.sliderContainer} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <Slider {...settings}>
          {books.map((book) => (
            <div key={book.id || book.title} style={styles.cardWrapper}>
                <Link to={`/books/${book.id || book.title.toLowerCase().replace(/ /g, '-')}`} style={styles.cardLink}>
                    <BookCard {...book} />
                </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FeaturedBooks;