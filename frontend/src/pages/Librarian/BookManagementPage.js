import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const statusOptions = [
  "available",
  "checked out",
  "lost",
  "damaged",
  "maintenance",
];
const genreOptions = [
  "Fiction",
  "Mystery",
  "Fantasy",
  "Romance",
  "Science Fiction",
  "Horror",
  "Biography",
  "History",
  "Self-help",
  "Children",
  "Poetry",
  "Philosophy",
  "Business",
  "Travel",
];

const initialForm = {
  title: "",
  author: "",
  publisher: "",
  genre: "",
  status: "available",
  image: null,
};

const BookManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    author: "",
    publisher: "",
    genre: "",
    status: "",
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [form, setForm] = useState(initialForm);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/books", {
        params: { ...filters, page: pagination.page, limit: 8 },
      });
      setBooks(res.data.data);
      setPagination({ page: res.data.page, totalPages: res.data.totalPages });
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters, pagination.page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      if (editingBook) {
        await axiosClient.put(`/books/${editingBook._id}`, formData);
      } else {
        await axiosClient.post("/books", formData);
      }

      setForm(initialForm);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Failed to save book:", err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      genre: book.genre,
      status: book.status,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axiosClient.delete(`/books/${id}`);
        fetchBooks();
      } catch (err) {
        console.error("Failed to delete book:", err);
      }
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingBook(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Book Management</h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <input
          name="search"
          placeholder="🔍 Search title"
          className="border px-3 py-2 rounded"
          value={filters.search}
          onChange={handleInputChange}
        />
        <input
          name="author"
          placeholder="✍️ Author"
          className="border px-3 py-2 rounded"
          value={filters.author}
          onChange={handleInputChange}
        />
        <input
          name="publisher"
          placeholder="🏢 Publisher"
          className="border px-3 py-2 rounded"
          value={filters.publisher}
          onChange={handleInputChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          {statusOptions?.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          name="genre"
          value={filters.genre}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Genre</option>
          {genreOptions?.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-100 p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="publisher"
          placeholder="Publisher"
          value={form.publisher}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        />
        <select
          name="genre"
          value={form.genre}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Genre</option>
          {genreOptions?.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        >
          {statusOptions?.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFormChange}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          {editingBook ? "Update" : "Create"}
        </button>
        {editingBook && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white rounded px-4 py-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* BOOK LIST */}
      {loading ? (
        <div>Loading books...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books?.map((book) => (
              <div
                key={book._id}
                className="border rounded p-4 shadow hover:shadow-md"
              >
                {book.imageUrl && (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h2 className="font-semibold">{book.title}</h2>
                <p>
                  <b>Author:</b> {book.author}
                </p>
                <p>
                  <b>Status:</b> {book.status}
                </p>
                <p>
                  <b>Genre:</b> {book.genre}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(book)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="px-4 py-2 bg-gray-200 rounded"
            >
              ◀️ Prev
            </button>
            <span className="px-4 py-2">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next ▶️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookManagementPage;
