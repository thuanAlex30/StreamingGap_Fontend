import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.user);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <h2>Profile Information</h2>
            <p>Username: {profileInfo.username}</p>
            <p>Email: {profileInfo.email}</p>
            <p>Role: {profileInfo.role}</p>
            <p>Subscription: {profileInfo.subscription_type}</p>
            <img src={profileInfo.avatar_url} alt="Profile Avatar" />
            {profileInfo.role === "ADMIN" && (
                <button><Link to={`/update-user/${profileInfo.user_id}`}>Update This Profile</Link></button>
            )}
        </div>
    );
}

export default ProfilePage;
