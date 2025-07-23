import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategorySidebar from '../../components/CategorySidebar';
import BookCard from '../../components/BookCard';
import bookApi from '../../api/bookApi';

const styles = {
  pageWrapper: { padding: '2rem 1rem', maxWidth: '1600px', margin: '0 auto' },
  mainLayout: { display: 'flex', gap: '3rem' },
  mainContent: { flexGrow: 1 },
  searchBar: { display: 'flex', width: '100%', marginBottom: '2rem' },
  searchInput: { flexGrow: 1, padding: '0.8rem 1rem', border: '1px solid #83552d', borderRadius: '8px', backgroundColor: '#f5e6c9', color: '#543512', fontSize: '1rem' },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  cardLink: { textDecoration: 'none' },
  gridTitle: { fontSize: '2rem', fontWeight: '700', color: '#f5e6c9', marginBottom: '2rem', marginTop: '1rem' },
};

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await bookApi.getAll();
        setBooks(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter by genre and search
  const filteredBooks = books.filter(b => {
    const matchesGenre = selectedGenre ? b.genre === selectedGenre : true;
    const matchesSearch = search.trim() === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(search.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.mainLayout}>
        <CategorySidebar
          selectedCategory={selectedGenre}
          onSelectCategory={setSelectedGenre}
        />
        <div style={styles.mainContent}>
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by book name or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#543512', margin: '2rem' }}>Loading books...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'red', margin: '2rem' }}>{error}</div>
          ) : filteredBooks.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#543512', margin: '2rem' }}>No books available.</div>
          ) : (
            <>
              <div style={styles.gridTitle}>{selectedGenre ? selectedGenre : 'All Books'}</div>
              <div style={styles.bookGrid}>
                {filteredBooks.map((book) => (
                  <Link
                    key={book._id || book.id}
                    to={`/books/${book._id || book.id}`}
                    style={styles.cardLink}
                  >
                    <BookCard {...book} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookListPage;