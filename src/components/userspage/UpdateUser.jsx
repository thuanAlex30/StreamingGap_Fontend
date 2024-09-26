import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

function UpdateUser() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract userId from URL params

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchUserDataById(userId);
  }, [userId]);

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getUserById(userId, token);
      const { username, email, role, avatar_url } = response.user;
      setUserData({ username, email, role, avatar_url });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await UserService.updateUser(userId, userData, token);
      console.log(res);
      navigate('/admin/user-management');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Error updating user');
    }
  };

  return (
      <div className="auth-container">
        <h2>Update User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <input
                type="text"
                name="role"
                value={userData.role}
                onChange={handleInputChange}
                required
            />
          </div>
          <div className="form-group">
            <label>Avatar URL:</label>
            <input
                type="text"
                name="avatar_url"
                value={userData.avatar_url}
                onChange={handleInputChange}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
  );
}

export default UpdateUser;
