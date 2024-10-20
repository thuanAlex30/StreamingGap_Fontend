import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const SongPlayer = ({ songId }) => {
    const [song, setSong] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Check if the token exists
        if (token) {
            setIsAuthenticated(true);
            fetchSong(token); // Pass the token to the fetch function
        } else {
            setIsAuthenticated(false);
        }
    }, [songId]);

    const fetchSong = async (token) => {
        try {
            const response = await axios.get(`/songs/${songId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the request header
                }
            });
            console.log("Song response:", response.data); // Debug log
            setSong(response.data.songDtoList[0]);
        } catch (error) {
            console.error("Error fetching song", error);
            setIsAuthenticated(false); // Set to false if there's an error
        }
    };

    const handlePlay = () => {
        const audio = new Audio(song.audio_file_url);
        audio.play();
    };

    // Redirect to login if not authenticated
    if (!isAuthenticated) return <Navigate to="/login" />;

    if (!song) return <p>Loading...</p>;

    return (
        <div>
            <h2>{song.title}</h2>
            <button onClick={handlePlay}>Play</button>
        </div>
    );
};

export default SongPlayer;
