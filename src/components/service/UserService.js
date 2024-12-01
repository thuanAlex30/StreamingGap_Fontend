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

    static async register(userData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Registration Error:', err.response ? err.response.data : err.message);
            throw new Error('Registration failed. Please try again later.');
        }
    }

    static async verifyCode(email, code) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/verify`, { email, code });
            return response.data;
        } catch (err) {
            console.error('Verification Error:', err.response ? err.response.data : err.message);
            throw new Error('Verification failed. Please check the code and try again.');
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
            const response = await axios.get(`${UserService.BASE_URL}/user/get-profile`, {
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
    static async updateUserByUser(userData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/user/updateProfile`,userData, {
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
// 
export default UserService;
