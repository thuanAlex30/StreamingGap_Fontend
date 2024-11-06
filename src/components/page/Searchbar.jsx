import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SearchBar = ({ onUserSelect }) => {
    const [username, setUsername] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Sử dụng useNavigate để khai báo navigate

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSearch = async () => {
        const token = localStorage.getItem("auth-token");

        if (!token) {
            setError("You need to be logged in to search.");
            navigate("/login"); // điều hướng đến trang đăng nhập nếu không có token
            return;
        }

        try {
            setError(null);
            const response = await axios.get(`http://localhost:1010/chatmessages/search?username=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSearchResults(response.data ? [response.data] : []);
        } catch (error) {
            console.error("Error searching for user:", error);
            setError("An error occurred while searching.");
        }
    };

    const handleUserSelect = (user) => {
        setUsername("");
        setSearchResults([]);
        onUserSelect(user);
    };

    return (
        <div className="relative w-64">
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Search username..."
                value={username}
                onChange={handleInputChange}
            />
            <button
                className="absolute right-0 top-0 mt-2 mr-2"
                onClick={handleSearch}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.5 17.5l4.5 4.5"
                    />
                </svg>
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {searchResults.map((user) => (
                        <div
                            key={user.id} // Sử dụng id hoặc một giá trị duy nhất khác làm key
                            className="cursor-pointer p-2 hover:bg-gray-100"
                            onClick={() => handleUserSelect(user)}
                        >
                            {user.username}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    onUserSelect: PropTypes.func.isRequired,
};
