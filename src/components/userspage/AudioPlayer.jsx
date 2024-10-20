import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import UserService from '../service/UserService';

const AudioPlayer = () => {
    const { songId } = useParams();
    const [audioUrl, setAudioUrl] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Check if the user is authenticated by checking the token
        if (token) {
            console.log("Token found:", token); // Debug log
            setIsAuthenticated(true);
            fetchSongDetails(token); // Pass the token to the fetch function
        } else {
            console.log("No token found."); // Debug log
            setIsAuthenticated(false);
        }
    }, [songId]);

    const fetchSongDetails = async (token) => {
        try {
            const songDetails = await UserService.getSongById(songId, token); // Adjust method to include token
            console.log("Fetched song details:", songDetails.data); // Debug log
            setAudioUrl(songDetails.data.audio_file_url); // Adjust based on your API response structure
        } catch (error) {
            console.error("Error fetching song details:", error);
            setIsAuthenticated(false); // Set to false if there's an error
        }
    };

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            {audioUrl ? (
                <audio controls>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AudioPlayer;
