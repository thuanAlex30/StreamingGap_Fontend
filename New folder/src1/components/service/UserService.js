import axios from "axios";

class UserService {
    static BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:1010"; // Use an environment variable

    static async login(username, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { username, password });
            // Store the token and username in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username); // assuming the response contains the username
            return response.data;
        } catch (err) {
            console.error('Login Error:', err.response ? err.response.data : err.message);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    }
        static getToken() {
        return localStorage.getItem('token');
    }
// Register a new user

static async register(userData) {
    try {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, userData, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response ? error.response.data : error.message);
        throw new Error("Registration failed. Please try again later.");
    }
}

// Xác thực mã xác minh email
static async verifyCode(email, code) {
    try {
        const response = await axios.post(`${this.BASE_URL}/auth/verify`, { email, code }, { withCredentials: true });
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Verification failed. Please check the code and try again.');
    } catch (error) {
        console.error("Verification Error:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message || error.message : "An unexpected error occurred.");
    }
}
// Forgot password
static async forgotPassword(email) {
    try {
        const response = await axios.post(`${this.BASE_URL}/auth/forgot-password`, { email });
        return response.data;
    } catch (err) {
        console.error('Forgot Password Error:', err.response ? err.response.data : err.message);
        throw new Error('Failed to request password reset. Please try again later.');
    }
}

// Reset password with verification code
static async resetPassword(code, newPassword) {
    try {
        const response = await axios.post(`${this.BASE_URL}/auth/reset-password`, { code, newPassword });
        return response.data;
    } catch (err) {
        // Đảm bảo trả về lỗi chi tiết từ backend nếu có
        const errorResponse = err.response?.data || "Failed to reset password. Please check the code and try again.";
        console.error('Reset Password Error:', errorResponse);
        throw new Error(errorResponse);
    }
}


    static async getSongById(songId) {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('Token not found. Please login again.');
            }

            const response = await axios.get(`${this.BASE_URL}/songs/${songId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching song by ID:', error);
            throw new Error('Failed to load song. Please try again later.');
        }
    }

    static async getAllSongs(token) {
        try {
            const response = await axios.get(`${this.BASE_URL}/songs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; // Assuming the API response is structured as shown
        } catch (error) {
            console.error("Error fetching songs:", error);
            throw new Error('Failed to fetch songs. Please try again later.');
        }
    }

    static async getSongId(songId,token) {
        try {
            const response = await axios.get(`${this.BASE_URL}/songs/${songId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; // Assuming the API response is structured as shown
        } catch (error) {
            console.error("Error fetching songs:", error);
            throw new Error('Failed to fetch songs. Please try again later.');
        }
    }



    static async getAllUsers(token) {
        try {
            console.log('Fetching all users...');
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('API Response:', response.data);
            return response.data;
        } catch (err) {
            console.error('Error fetching users:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch users. Please check your network connection or try again later.');
        }
    }

    static async getYourProfile(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching profile:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch profile. Please try again later.');
        }
    }

    static async getUserById(userId, token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching user by ID:', err.response ? err.response.data : err.message);
            throw new Error('Failed to fetch user. Please try again later.');
        }
    }

    static async deleteUser(userId, token) {
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error deleting user:', err.response ? err.response.data : err.message);
            throw new Error('Failed to delete user. Please try again later.');
        }
    }

    static async updateUser(userId, userData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error updating user:', err.response ? err.response.data : err.message);
            throw new Error('Failed to update user. Please try again later.');
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;
