import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";

const statusOptions = [
  "available",
  "checked out",
  "lost",
  "damaged",
  "maintenance"
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
  "Travel"
];

const BookModal = ({ open, onClose, onSubmit, mode = "add", book = {}, loading }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState({
    title: "",
    author: "",
    ISBN: "",
    genre: "Fiction",
    publishedDate: "",
    publisher: "",
    status: "available",
    summary: "",
    imageUrl: ""
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (isEdit || isView) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        ISBN: book.ISBN || "",
        genre: book.genre || "Fiction",
        publishedDate: book.publishedDate ? book.publishedDate.substring(0, 10) : "",
        publisher: book.publisher || "",
        status: book.status || "available",
        summary: book.summary || "",
        imageUrl: book.imageUrl || ""
      });
      setPreview(book.imageUrl || "");
      setFile(null);
    } else {
      setForm({ title: "", author: "", ISBN: "", genre: "Fiction", publishedDate: "", publisher: "", status: "available", summary: "", imageUrl: "" });
      setPreview("");
      setFile(null);
    }
  }, [book, mode, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview("");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitForm = { ...form };
    // Always send all required fields
    if (file) {
      const fd = new FormData();
      Object.keys(submitForm).forEach((key) => fd.append(key, submitForm[key]));
      fd.append("image", file);
      // Remove imageUrl from FormData if file is present (backend should set imageUrl from upload)
      fd.delete("imageUrl");
      if (onSubmit) onSubmit(fd, true); // true = multipart
    } else {
      // Only send imageUrl if no file
      if (onSubmit) onSubmit({ ...submitForm, imageUrl: submitForm.imageUrl });
    }
  };

  if (!open) return null;

  return (
    <div className={`modal-overlay active`}>
      <div className="modal-content" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">{isView ? "visibility" : isEdit ? "edit" : "add"}</span>
            {isView ? "View Book" : isEdit ? "Edit Book" : "Add Book"}
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit} style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <div className="form-group">
            <label>ISBN</label>
            {isView ? (
              <div className="detail-value">{form.ISBN}</div>
            ) : (
              <input
                className="form-control"
                name="ISBN"
                value={form.ISBN}
                onChange={handleChange}
                required
                disabled={loading}
              />
            )}
          </div>
          <div className="form-group">
            <label>Title</label>
            {isView ? (
              <div className="detail-value">{form.title}</div>
            ) : (
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            )}
          </div>
          <div className="form-group">
            <label>Author</label>
            {isView ? (
              <div className="detail-value">{form.author}</div>
            ) : (
              <input
                className="form-control"
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                disabled={loading}
              />
            )}
          </div>
          <div className="form-row form-row-double">
            <div className="form-group" style={{ flex: 1, marginRight: 8 }}>
              <label>Genre</label>
              {isView ? (
                <div className="detail-value">{form.genre}</div>
              ) : (
                <select
                  className="form-control"
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {genreOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group" style={{ flex: 1, marginLeft: 8 }}>
              <label>Status</label>
              {isView ? (
                <div className="detail-value" style={{ textTransform: "capitalize" }}>{form.status}</div>
              ) : (
                <select
                  className="form-control"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="form-row form-row-double">
            <div className="form-group" style={{ flex: 1, marginRight: 8 }}>
              <label>Publisher</label>
              {isView ? (
                <div className="detail-value">{form.publisher}</div>
              ) : (
                <input
                  className="form-control"
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                  disabled={loading}
                />
              )}
            </div>
            <div className="form-group" style={{ flex: 1, marginLeft: 8 }}>
              <label>Published Date</label>
              {isView ? (
                <div className="detail-value">{form.publishedDate}</div>
              ) : (
                <input
                  className="form-control"
                  name="publishedDate"
                  type="date"
                  value={form.publishedDate}
                  onChange={handleChange}
                  disabled={loading}
                />
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Summary</label>
            {isView ? (
              <div className="detail-value">{form.summary}</div>
            ) : (
              <textarea
                className="form-control"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows={3}
                style={{ width: '100%' }}
                disabled={loading}
              />
            )}
          </div>
          <div className="form-group">
            <label>Book Cover</label>
            {isView ? (
              preview ? <img src={preview} alt="Book Cover" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, marginBottom: 8 }} /> : <div className="detail-value">No image</div>
            ) : (
              <>
                {!file && (
                  <>
                    <input
                      className="form-control"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="Paste image URL..."
                      disabled={loading}
                      style={{ marginBottom: 8, width: '100%' }}
                    />
                    <div style={{ textAlign: 'center', color: '#888', fontWeight: 500, margin: '4px 0' }}>or</div>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      style={{ marginBottom: 8, width: '100%' }}
                    />
                  </>
                )}
                {file && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, marginBottom: 8 }} />}
                    <button type="button" className="btn btn-secondary" onClick={handleRemoveFile} style={{ marginBottom: 8 }}>Remove</button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="modal-footer" style={{ flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
            {isView ? (
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            ) : (
              <>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Book"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal; 