import axios from "axios";

class CommentService {
<<<<<<< HEAD
    static BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:1010"; // Use an environment variable
=======
    static BASE_URL = process.env.REACT_APP_BASE_URL || "https://streaminggap.onrender.com";
>>>>>>> e90d4c1f1c03e28abb499b9d1fe1d8d1d5dbd57f

    static async getAllComments(token) {
        try {
            const response = await axios.get(`${this.BASE_URL}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw new Error('Failed to fetch comments. Please try again later.');
        }
    }

    static async getCommentsBySongId(songId, token) {
        try {
            const response = await axios.get(`${this.BASE_URL}/comments/song/${songId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });   
            return response.data; 
        } catch (error) {
            console.error("Error fetching comments by song ID:", error);
            throw new Error('Failed to fetch comments. Please try again later.');
        }
    }

    static async createComment(commentData, token) {
        try {
            const response = await axios.post(`${this.BASE_URL}/comments`, commentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating comment:", error);
            throw new Error('Failed to create comment. Please try again later.');
        }
    }

    static async deleteComment(commentId, token) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw new Error('Failed to delete comment. Please try again later.');
        }
    }

    static async updateComment(commentId, commentData, token) {
        try {
            const response = await axios.put(`${this.BASE_URL}/comments/${commentId}`, commentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating comment:", error);
            throw new Error('Failed to update comment. Please try again later.');
        }
    }
}

export default CommentService;
