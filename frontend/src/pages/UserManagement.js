import React, { useEffect, useState } from "react";
import axios from "axios";
import UserModal from "../components/UserModal";
import "../styles/dashboard.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchCurrentUserRole();
  }, []);

  const fetchCurrentUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/member/profile/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.data && res.data.data.role) {
        setCurrentUserRole(res.data.data.role);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      setUsers([]);
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setModalMode("add");
    setModalOpen(true);
  };
  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };
  const openViewModal = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddEdit = async (form) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // If manager is editing, only allow role changes
      let updateData = form;
      if (modalMode === "edit" && currentUserRole === "manager") {
        updateData = { role: form.role }; // Manager can only change role
      }
      
      if (modalMode === "add") {
        await axios.post("http://localhost:5000/users", updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modalMode === "edit" && selectedUser) {
        await axios.put(`http://localhost:5000/users/${selectedUser._id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id, username) => {
    if (!window.confirm(`Are you sure you want to ban user "${username}"?`)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert(`User "${username}" has been banned successfully.`);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (id, username) => {
    if (!window.confirm(`Are you sure you want to unban user "${username}"?`)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/users/${id}/unban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert(`User "${username}" has been unbanned successfully.`);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const name = user.name || "";
    const email = user.email || "";
    const role = user.role || "";
    const phone = user.phone || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="content-container">
      <UserModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleAddEdit}
        mode={modalMode}
        user={selectedUser || {}}
        loading={loading}
        currentUserRole={currentUserRole}
      />
      <div className="user-table-card">
        <div className="user-table-header-row">
          <div className="user-table-header-title">User Management</div>
          <div className="user-table-header-actions">
            {/* Only librarians can add users, managers can only edit roles */}
            {currentUserRole === 'librarian' && (
              <button className="add-user-btn" onClick={openAddModal} disabled={loading}>
                <span className="material-icons">add_circle</span>
                Add User
              </button>
            )}
            {currentUserRole === 'manager' && (
              <div className="manager-note">
                <span className="material-icons">info</span>
                You can only edit user roles
              </div>
            )}
            <div className="search-bar">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Search by Name, Email, Role, Phone"
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td style={{ textTransform: "capitalize" }}>{user.role || '-'}</td>
                    <td>
                      <span className={`status-badge ${user.status === 'banned' ? 'status-banned' : 'status-active'}`}>
                        {user.status === 'banned' ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-action btn-view" title="View Details" onClick={() => openViewModal(user)} disabled={loading}>
                          <span className="material-icons" style={{ color: '#111' }}>visibility</span>
                        </button>
                        <button className="btn-action btn-edit" title="Edit User" onClick={() => openEditModal(user)} disabled={loading}>
                          <span className="material-icons" style={{ color: '#111' }}>edit</span>
                        </button>
                        {currentUserRole === 'manager' && user.role !== 'manager' && (
                          <>
                            {user.status === 'active' ? (
                              <button className="btn-action btn-ban" title="Ban User" onClick={() => handleBan(user._id, user.name)} disabled={loading}>
                                <span className="material-icons" style={{ color: '#111' }}>block</span>
                              </button>
                            ) : (
                              <button className="btn-action btn-unban" title="Unban User" onClick={() => handleUnban(user._id, user.name)} disabled={loading}>
                                <span className="material-icons" style={{ color: '#111' }}>check_circle</span>
                              </button>
                            )}
                          </>
                        )}
                        {currentUserRole === 'librarian' && (
                          <button className="btn-action btn-delete" title="Delete User" onClick={() => handleDelete(user._id)} disabled={loading}>
                            <span className="material-icons" style={{ color: '#111' }}>delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 