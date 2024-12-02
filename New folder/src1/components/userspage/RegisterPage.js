import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../css/AuthPages.css'; // Import the combined CSS file

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setName] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userData = { email, password, username };
            const response = await UserService.register(userData);
            setMessage('A verification code has been sent to your email. Please check your inbox.');
            navigate('/verify'); // Only navigate when registration is successful
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data === "Email đã được sử dụng.") {
                setError('This email is already in use. Please try with a different email.');
            } else {
                setError('Registration failed. Please try again later.');
            }
        }
    };

    return (
        <div className="auth-page register-page">
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
