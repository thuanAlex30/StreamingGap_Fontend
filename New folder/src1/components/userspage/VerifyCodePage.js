import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../css/AuthPages.css'; // Import the combined CSS file

const VerifyCodePage = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const result = await UserService.verifyCode(email, code);
            navigate('/'); // Navigate to the homepage on successful verification
        } catch (err) {
            setError(err.message);  // Display error message if any
        }
    };

    return (
        <div className="auth-page verify-code-page">
            <form onSubmit={handleVerify}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
                {error && <p style={{ color: 'red' }}>{"Verification failed. Please check the code and try again"}</p>}
            </form>
        </div>
    );
};

export default VerifyCodePage;
