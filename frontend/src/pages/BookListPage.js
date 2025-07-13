// File: frontend/src/pages/BookListPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import CategorySidebar from '../components/CategorySidebar';
import BookCard from '../components/BookCard';

// Dữ liệu mẫu đầy đủ
const collectionsByCategory = [
  {
    category: "Editor's Picks",
    books: [
      { id: 'dac-nhan-tam', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', imageUrl: 'https://i.pinimg.com/1200x/1c/22/df/1c22df7132ad8f1358688b23831e9eaf.jpg', price: 89000 },
      { id: 'nha-gia-kim', title: 'Nhà Giả Kim', author: 'Paulo Coelho', imageUrl: 'https://i.pinimg.com/736x/d6/fe/7a/d6fe7a345fae0de4a2d9e86d1a181c62.jpg', price: 79000 },
      { id: 'hoang-tu-be', title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', imageUrl: 'https://i.pinimg.com/736x/73/fe/f2/73fef2d17b9f311e713bee4bcba584d7.jpg', price: 59000 },
      { id: 'dune', title: 'Dune', author: 'Frank Herbert', imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1555447414l/44767458.jpg', price: 250000 },
    ]
  },
  {
    category: 'Featured Sellers',
    books: [
      { id: 'ca-phe-cung-tony', title: 'Cà phê cùng Tony', author: 'Tony Buổi Sáng', imageUrl: 'https://i.pinimg.com/1200x/13/4c/f6/134cf6f5c279eaf36e0cd380116d89ff.jpg', price: 99000 },
      { id: 'ty-phu-ban-giay', title: 'Tỷ phú bán giày', author: 'Tony Hsieh', imageUrl: 'https://i.pinimg.com/1200x/a8/f1/30/a8f13062a2634ee4eafbc5492d0f0f16.jpg', price: 129000 },
      { id: 'the-song-of-achilles', title: 'The Song of Achilles', author: 'Madeline Miller', imageUrl: 'https://i.pinimg.com/736x/1a/93/eb/1a93ebfac1d89aba46dd9fa4af2cd73d.jpg', price: 180000 },
      { id: 'circe', title: 'Circe', author: 'Madeline Miller', imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1565909496l/35959740.jpg', price: 195000 },
    ]
  },
  {
    category: 'First Edition Books',
    books: [
      { id: 'khong-gia-dinh', title: 'Không Gia Đình', author: 'Hector Malot', imageUrl: 'https://i.pinimg.com/1200x/42/66/87/42668721450f1854c0634e6a765ee821.jpg', price: 115000 },
      { id: 'a-man-called-ove', title: 'A Man Called Ove', author: 'Fredrik Backman', imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1405259930l/18774964.jpg', price: 155000 },
      { id: 'Think & Grow Rich', title: 'Think & Grow Rich', author: 'Napoleon Hill', imageUrl: 'https://i.pinimg.com/736x/89/59/4e/89594ec4c7aea0e1579dc738afb9fefa.jpg', price: 110000 },
      { id: 'Mặc kệ thiên hạ - Sống như người Nhật', title: 'Mặc kệ thiên hạ - Sống như người Nhật', author: 'Mari Tamagawa', imageUrl: 'https://i.pinimg.com/736x/a7/fe/fe/a7fefe79d7b4c91e004f40ca61e92d65.jpg', price: 67000 },
    ]
  },
  {
    category: 'Signed Books',
    books: [
        { id: 'Thép Đã Tôi Thế Đấy', title: 'Thép Đã Tôi Thế Đấy', author: 'Nikolai Ostrovsky', imageUrl: 'https://i.pinimg.com/736x/47/3b/e8/473be837f5e5003eff2c971e85309954.jpg', price: 135000 },
        { id: 'Tắt đèn', title: 'Tắt đèn', author: 'Ngô Tất Tố', imageUrl: 'https://i.pinimg.com/736x/e3/c3/3e/e3c33ed5f3d5d99567ae20bd138aa913.jpg ', price: 100000 },
        { id: 'Đất rừng phương Nam', title: 'Đất rừng phương Nam', author: 'Đoàn Giỏi', imageUrl: 'https://i.pinimg.com/736x/25/c0/0c/25c00c9d9b17c714ee2209044679b6fe.jpg', price: 120000 },
        { id: 'Thao Túng Tâm Lý', title: 'Thao Túng Tâm Lý', author: 'Shannon Thomas', imageUrl: 'https://i.pinimg.com/736x/67/5c/53/675c5385b513586a05975efa3e01b4e5.jpg', price: 96000 },
        
    ]
  },
];

const styles = {
  // Đặt chiều rộng tối đa và căn giữa cho toàn trang
  pageWrapper: { padding: '2rem 1rem', maxWidth: '1600px', margin: '0 auto' },
  mainLayout: { display: 'flex', gap: '3rem' },
  mainContent: { flexGrow: 1 },
  searchBar: { display: 'flex', width: '100%', marginBottom: '2rem' },
  searchInput: { flexGrow: 1, padding: '0.8rem 1rem', border: '1px solid #83552d', borderRadius: '8px 0 0 8px', backgroundColor: '#f5e6c9', color: '#543512', fontSize: '1rem' },
  searchButton: { padding: '0 1.5rem', border: 'none', backgroundColor: '#ffae00', color: '#543512', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  categorySection: { marginBottom: '3rem' },
  categoryTitle: { fontSize: '1.8rem', fontWeight: '600', color: '#f5e6c9', borderBottom: '1px solid #83552d', paddingBottom: '0.8rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  viewAllButton: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", color: '#e1bb80', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s' },
  // BỐ CỤC 4 CỘT
  bookGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }, // Giảm gap
  cardLink: { textDecoration: 'none' }
};

const BookListPage = () => {
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.mainLayout}>
        <CategorySidebar />
        <div style={styles.mainContent}>
          <div style={styles.searchBar}>
              <input type="text" placeholder="Search our entire collection..." style={styles.searchInput} />
              <button style={styles.searchButton}>Search</button>
          </div>
          
          {collectionsByCategory.map(collection => (
            <section key={collection.category} style={styles.categorySection}>
              <div style={styles.categoryTitle}>
                <span>{collection.category}</span>
                <button style={styles.viewAllButton} onMouseOver={e => e.target.style.color='#ffae00'} onMouseOut={e => e.target.style.color='#e1bb80'}>View all</button>
              </div>
              <div style={styles.bookGrid}>
                {collection.books.map((book) => (
                  <Link key={book.id} to={`/books/${book.id}`} style={styles.cardLink}>
                    <BookCard {...book} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookListPage;