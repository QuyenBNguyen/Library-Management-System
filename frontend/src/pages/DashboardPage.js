import React, { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const [users] = useState([
    {
      id: "USR001",
      name: "Nguyen Van Quyen",
      email: "quyen.nguyen@library.com",
      phone: "+84 123 456 789",
      role: "Librarian",
      status: "Active"
    },
    {
      id: "USR002", 
      name: "Tran Thi Mai",
      email: "mai.tran@library.com",
      phone: "+84 987 654 321",
      role: "Member",
      status: "Active"
    },
    {
      id: "USR003",
      name: "Le Van Duc",
      email: "duc.le@library.com", 
      phone: "+84 555 123 456",
      role: "Member",
      status: "Inactive"
    },
    {
      id: "USR004",
      name: "Pham Thi Lan",
      email: "lan.pham@library.com",
      phone: "+84 777 888 999",
      role: "Librarian", 
      status: "Active"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    console.log("Logout clicked");
    // future: redirect or clear auth
  };

  const handleEdit = (id) => {
    console.log("Edit user", id);
    // TODO: Open update modal
  };

  const handleDelete = (id) => {
    console.log("Delete user", id);
    // TODO: Confirm and delete
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <DashboardSidebar active="Dashboard" onLogout={handleLogout} />
      <div className="main-content">
        <DashboardHeader username="Quyen" role="Librarian" />

        {/* Content Header */}
        <div className="content-container">
          <div className="content-header">
            <h1 className="page-title">User Management</h1>
            <div className="content-actions">
              <button className="add-user-btn">
                <span className="material-icons">add_circle</span>
                Add User
              </button>
              <div className="search-bar">
                <span className="material-icons">search</span>
                <input 
                  type="text" 
                  placeholder="Search by ID or Name" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn-action btn-view" 
                            onClick={() => handleEdit(user.id)}
                            title="View Details"
                          >
                            <span className="material-icons">visibility</span>
                          </button>
                          <button 
                            className="btn-action btn-edit" 
                            onClick={() => handleEdit(user.id)}
                            title="Edit User"
                          >
                            <span className="material-icons">edit</span>
                          </button>
                          <button 
                            className="btn-action btn-delete" 
                            onClick={() => handleDelete(user.id)}
                            title="Delete User"
                          >
                            <span className="material-icons">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Total Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{users.length}</p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Active Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {users.filter(user => user.status === 'Active').length}
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Librarians</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {users.filter(user => user.role === 'Librarian').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
