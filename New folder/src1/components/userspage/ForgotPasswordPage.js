import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UserService from "../service/UserService";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleForgotPassword = async () => {
        try {
            await UserService.forgotPassword(email);
            alert("Đã gửi yêu cầu reset password, vui lòng kiểm tra email.");
            // Điều hướng đến trang Reset Password kèm theo email (nếu cần)
            navigate("/reset-password", { state: { email } });
        } catch (error) {
            alert("Yêu cầu reset password thất bại! Vui lòng thử lại.");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Submit</button>
        </div>
    );
}

export default ForgotPasswordPage;
