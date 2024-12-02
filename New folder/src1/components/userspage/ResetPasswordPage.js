import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import UserService from "../service/UserService";
import '../css/AuthPages.css';

function ResetPasswordPage() {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            await UserService.resetPassword(code, newPassword);
            alert("Reset password thành công!");
            navigate("/"); // Điều hướng về trang chính
        } catch (error) {
            // Lấy thông báo từ backend nếu có
            const errorMessage = error.response?.data || "Reset password thất bại! Vui lòng kiểm tra lại mã xác nhận.";
            alert(errorMessage);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
}

export default ResetPasswordPage;
