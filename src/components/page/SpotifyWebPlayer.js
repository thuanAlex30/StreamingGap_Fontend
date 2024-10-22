import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import '../css/SpotifyWebPlayer.css';

const SpotifyWebPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token not found.');

                const response = await UserService.getAllSongs(token);
                setSongs(response.songDtoList);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching songs:", err);
                setError(err.message || "Failed to load songs.");
                setIsLoading(false);
            }
        };

        fetchSongs();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (songs.length === 0) {
        return <p>No songs available.</p>;
    }

    return (
        <div className="player-container">
            <h2>Spotify Music Player</h2>
            <div className="songs-grid">
                {songs.map(song => (
                    <div key={song.song_id} className="song-card">
                        <iframe
                            src={song.audio_file_url.replace("https://open.spotify.com/track/", "https://open.spotify.com/embed/track/")}
                            width="300"
                            height="380"
                            frameBorder="0"
                            allow="encrypted-media"
                            title={`Spotify Player for ${song.title || 'Untitled Song'}`}
                        ></iframe>
                        <h5>{song.title || 'Untitled Song'}</h5>
                        <p>{song.artist || 'Unknown Artist'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpotifyWebPlayer;
