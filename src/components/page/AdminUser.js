import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TextField,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import UserService from '../service/UserService';
import AdminPage from './Adminpage';
import Header from '../common/Header';

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null); 
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        avatar_url: '' 
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    setLoading(false);
                    return;
                }

                const userData = await UserService.getAllUsers(token);
                if (userData && userData.userList) {
                    console.log(userData.userList)
                    setUsers(userData.userList);
                } else {
                    setError("No users found.");
                }
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url 
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await UserService.updateUser(editUser.user_id, formData, token);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === editUser.user_id ? { ...user, ...formData } : user
                )
            );
            setEditUser(null);
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Failed to update user. Please try again later.");
        }
    };

    const handleDelete = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await UserService.deleteUser(userId, token);

            setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Failed to delete user. Please try again later.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Header/>
        <div style={{display:'flex'}}>
            <AdminPage/>
        <div style={{ display:'block', padding: '20px',width:'1000px' }}>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'left', marginLeft: '10px' }}>
             User Management
         </h1>
                  
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.user_id}>
                                    <TableCell>{user.user_id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <img
                                            src={user.avatar_url}
                                            alt="Avatar"
                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                        />
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(user.user_id)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>No users found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

           </div>
            {/* Modal or form for editing */}
            {editUser && (
                <div  style={{ marginTop: '40px',width:'300px',display:'block' }}>
                    <h2>Edit User</h2>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '15px' }}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Avatar URL"
                            name="avatar_url"
                            value={formData.avatar_url}
                            onChange={handleChange}
                        />
                        <FormControl>
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="USER">User</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <div>
                            <Button variant="contained" color="primary" onClick={handleUpdate}>
                                Save Changes
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setEditUser(null)}
                                style={{ marginLeft: '10px' }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
        </div>
    );
};

export default AdminUser;