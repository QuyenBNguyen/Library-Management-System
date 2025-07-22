import React, { useEffect, useState } from "react";
import axios from "axios";
import BookModal from "../components/BookModal";
import "../styles/dashboard.css";

const BookManagement = ({ userRole = 'member' }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data.data || res.data || []);
    } catch (err) {
      setBooks([]);
    }
  };

  const openAddModal = () => {
    setSelectedBook(null);
    setModalMode("add");
    setModalOpen(true);
  };
  const openEditModal = (book) => {
    setSelectedBook(book);
    setModalMode("edit");
    setModalOpen(true);
  };
  const openViewModal = (book) => {
    setSelectedBook(book);
    setModalMode("view");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleAddEdit = async (form) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (modalMode === "add") {
        await axios.post("http://localhost:5000/api/books", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modalMode === "edit" && selectedBook) {
        await axios.put(`http://localhost:5000/api/books/${selectedBook._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchBooks();
      closeModal();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const ISBN = book.ISBN || "";
    const title = book.title || "";
    const author = book.author || "";
    const status = book.status || "";
    return (
      ISBN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="content-container">
      <BookModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleAddEdit}
        mode={modalMode}
        book={selectedBook || {}}
        loading={loading}
      />
      <div className="user-table-card">
        <div className="user-table-header-row">
          <div className="user-table-header-title">Book Management</div>
          <div className="user-table-header-actions">
            {userRole !== 'manager' && (
              <button className="add-user-btn" onClick={openAddModal} disabled={loading}>
                <span className="material-icons">add_circle</span>
                Add Book
              </button>
            )}
            <div className="search-bar">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Search by ISBN, Title, Author, Status"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="user-table-scroll">
          <table className="user-table">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Summary</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.ISBN}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.status || '-'}</td>
                    <td style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.summary || '-'}</td>
                    <td>{book.imageUrl ? <img src={book.imageUrl} alt="cover" style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 4 }} /> : '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-action btn-view" title="View Details" onClick={() => openViewModal(book)} disabled={loading}>
                          <span className="material-icons" style={{ color: '#111' }}>visibility</span>
                        </button>
                        {userRole !== 'manager' && <>
                          <button className="btn-action btn-edit" title="Edit Book" onClick={() => openEditModal(book)} disabled={loading}>
                            <span className="material-icons" style={{ color: '#111' }}>edit</span>
                          </button>
                          <button className="btn-action btn-delete" title="Delete Book" onClick={() => handleDelete(book._id)} disabled={loading}>
                            <span className="material-icons" style={{ color: '#111' }}>delete</span>
                          </button>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookManagement; 