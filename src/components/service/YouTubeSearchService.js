import axios from "axios";

class YouTubeSearchService {
    static BASE_URL = "https://www.googleapis.com/youtube/v3/search";
    static API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Lấy API key từ biến môi trường

    // Tìm kiếm video trên YouTube
    static async searchVideos(query) {
        try {
            const response = await axios.get(`${this.BASE_URL}`, {
                params: {
                    part: "snippet",
                    type: "video",
                    q: query,
                    key: this.API_KEY,
                }
            });
            return response.data.items;
        } catch (error) {
            console.error("Error searching YouTube:", error);
            throw new Error("Failed to search videos. Please try again later.");
        }
    }
}

export default YouTubeSearchService;