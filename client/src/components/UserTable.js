import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../public/css/dashboard.css";

const UserTable = ({ userType = "members", role = "Librarian" }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users?type=${userType}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [userType]);

  const handleEdit = (id) => {
    console.log("Edit user", id);
    // TODO: Open update modal
  };

  const handleDelete = (id) => {
    console.log("Delete user", id);
    // TODO: Confirm and delete
  };

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  <button className="btn-sm" onClick={() => handleEdit(user._id)}>
                    Edit
                  </button>
                  {role === "Manager" && (
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
