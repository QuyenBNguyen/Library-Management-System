import React from 'react';
import { Link } from 'react-router-dom'; // Thêm Link vào đây

const styles = {
  card: {
    backgroundColor: '#f5e6c9', color: '#543512', borderRadius: '8px', border: '1px solid #83552d',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'transform 0.3s, box-shadow 0.3s',
    width: '260px', overflow: 'hidden', display: 'flex', flexDirection: 'column', margin: '0 auto',
  },
  coverImage: { width: '100%', height: '330px', objectFit: 'cover' },
  content: { padding: '1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  title: { fontSize: '1.1rem', fontWeight: '600', minHeight: '50px', marginBottom: '0.2rem' },
  author: { fontSize: '0.85rem', color: '#83552d', marginBottom: '0.4rem' },
  price: { fontSize: '1.1rem', fontWeight: '700', color: '#D9534F', marginBottom: '1rem', marginTop: 'auto' },
  button: {
    backgroundColor: '#ffae00', color: '#543512', border: 'none', borderRadius: '6px',
    padding: '0.6rem', width: '100%', cursor: 'pointer', fontWeight: '600',
    fontSize: '0.9rem', textDecoration: 'none', display: 'block', textAlign: 'center'
  },
};

// Thêm prop 'id' để tạo link
const BookCard = ({ id, title, author, imageUrl, price }) => {
  return (
    <div style={styles.card} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <img src={imageUrl} alt={`Cover for ${title}`} style={styles.coverImage} />
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.author}>by {author}</p>
        <p style={styles.price}>{price ? price.toLocaleString('vi-VN') : 'Liên hệ'} đ</p>
        {/* SỬA LẠI Ở ĐÂY: BỌC NÚT BẤM TRONG THẺ LINK */}
        <Link to={`/books/${id}`} style={styles.button}>View Details</Link>
      </div>
    </div>
  );
};

export default BookCard;