import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";

const roles = [
  { value: "member", label: "Member" },
  { value: "librarian", label: "Librarian" }
];

const UserModal = ({ open, onClose, onSubmit, mode = "add", user = {}, loading, currentUserRole }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";
  const isManager = currentUserRole === "manager";
  const isLibrarian = currentUserRole === "librarian";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    phone: ""
  });

  useEffect(() => {
    if (isEdit || isView) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "member",
        phone: user.phone || ""
      });
    } else {
      setForm({ name: "", email: "", password: "", role: "member", phone: "" });
    }
  }, [user, mode, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className={`modal-overlay active`}>
      <div className="modal-content" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">{isView ? "visibility" : isEdit ? "edit" : "person_add"}</span>
            {isView ? "View User" : isEdit ? "Edit User" : "Add User"}
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Name field - hidden for manager when editing */}
          {!(isManager && isEdit) && (
            <div className="form-group">
              <label>Name</label>
              {isView ? (
                <div className="detail-value">{form.name}</div>
              ) : (
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              )}
            </div>
          )}
          
          {/* Email field - hidden for manager when editing */}
          {!(isManager && isEdit) && (
            <div className="form-group">
              <label>Email</label>
              {isView ? (
                <div className="detail-value">{form.email}</div>
              ) : (
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              )}
            </div>
          )}
          
          {/* Password field - hidden for manager when editing */}
          {(isAdd || isEdit) && !(isManager && isEdit) && (
            <div className="form-group">
              <label>Password{isEdit ? " (leave blank to keep)" : ""}</label>
              <input
                className="form-control"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isEdit ? "Leave blank to keep current password" : ""}
                disabled={loading}
                required={isAdd}
              />
            </div>
          )}
          
          {/* Role field - always shown, but for manager editing only this field is shown */}
          <div className="form-group">
            <label>Role</label>
            {isView ? (
              <div className="detail-value" style={{ textTransform: "capitalize" }}>{form.role}</div>
            ) : (
              <select
                className="form-control"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            )}
          </div>
          
          {/* Manager editing: Show user info as read-only */}
          {isManager && isEdit && (
            <>
              <div className="form-group">
                <label>User Information (Read-only)</label>
                <div className="user-info-readonly">
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
                </div>
              </div>
            </>
          )}
          
          {/* Phone field - hidden for manager when editing */}
          {!(isManager && isEdit) && (
            <div className="form-group">
              <label>Phone</label>
              {isView ? (
                <div className="detail-value">{form.phone}</div>
              ) : (
                <input
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              )}
            </div>
          )}
          <div className="modal-footer">
            {isView ? (
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            ) : (
              <>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Save Changes" : "Add User"}
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

export default UserModal; 