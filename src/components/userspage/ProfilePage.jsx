import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import UserService from '../service/UserService';
import Header from '../common/Header';
import UpdateUser from './UpdateUser';

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
                }
                const response = await UserService.getYourProfile(token);
                setProfileInfo(response.user);
                console.log(response);
            } catch (error) {
                console.error("Error fetching profile information:", error.message || error);
            }
        };
        fetchProfileInfo();
    }, []);

    return (
        <div>
        <div style={{marginBottom:'70px'}}>
        < Header/>
        </div>
        <div style={styles.container}>
            <div style={styles.card}>
                {profileInfo.avatar_url && (
                    <img
                        src={profileInfo.avatar_url}
                        alt="User Avatar"
                        style={styles.avatar}
                    />
                )}
                <div style={styles.info}>
                    <h2 style={styles.name}>{profileInfo.username || "Người dùng"}</h2>
                    <p style={styles.email}>
                        <strong>Email:</strong> {profileInfo.email || "Không có thông tin"}
                    </p>
                    <p style={styles.role}>
                        <strong>Role:</strong> {profileInfo.role || "Không có thông tin"}
                    </p>
                    <p style={styles.subscription}>
                        <strong>Subscription:</strong>{" "}
                        {profileInfo.subscription_type || "Không có thông tin"}
                    </p>
                    {/* Nút dẫn đến trang Update User */}
                    <UpdateUser/>
                </div>
            </div>
        </div>
        </div>
    );
}

const styles = {
    container: {
        
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
    },
    card: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        width:'1000px'
    },
    avatar: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        marginRight: "20px",
        border: "2px solid #007BFF",
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: "22px",
        fontWeight: "bold",
    },
    email: {
        fontSize: "16px",
        marginBottom: "5px",
    },
    role: {
        fontSize: "16px",
        color: "#007BFF",
        marginBottom: "5px",
    },
    subscription: {
        fontSize: "16px",
        color: "#28a745",
        marginBottom: "15px",
    },
    updateButton: {
        display: "inline-block",
        padding: "10px 15px",
        backgroundColor: "#007BFF",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px",
        fontWeight: "bold",
        textAlign: "center",
        transition: "background-color 0.3s",
    },
};

export default ProfilePage;
