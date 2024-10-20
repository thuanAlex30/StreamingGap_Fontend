import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const response = await UserService.getAllUsers(token);
      console.log('Fetched users:', response.userList);
      setUsers(response.userList);
    } catch (err) {
      console.error('Error fetching users:', err.response ? err.response.data : err.message);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this user?');
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        await UserService.deleteUser(userId, token);
        fetchUsers(); // Re-fetch users after deletion
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };
  const handleUpdate = (userId) => {
    navigate(`/update-user/${userId}`);
  };
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;
  return (
      <div className="user-management-container">
        <h2>User Management Page</h2>
        <button className="reg-button">
          <Link to="/register">Add User</Link>
        </button>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Avatar</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {Array.isArray(users) && users.length > 0 ? (
              users.map(user => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <img src={user.avatar_url} alt={`${user.username}'s avatar`} style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => deleteUser(user.user_id)}>
                        Delete
                      </button>
                      <button onClick={() => handleUpdate(user.user_id)}>
                        Update
                      </button>
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
  );
}
export default UserManagementPage;