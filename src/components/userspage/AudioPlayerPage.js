import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import UserService from '../service/UserService';
import '../common/Header.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const AudioPlayerPage = () => {
    const { songId } = useParams();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullLyrics, setShowFullLyrics] = useState(false); // Trạng thái để kiểm soát việc hiển thị toàn bộ lời bài hát

    const MAX_LYRICS_LENGTH = 200; // Giới hạn số ký tự hiển thị ban đầu

    useEffect(() => {
        const fetchAudioUrl = async () => {
            try {
                const token = UserService.getToken();
                if (!token) {
                    throw new Error('Token not found. Please login again.');
                }

                const response = await axios.get(`https://streaminggap.onrender.com/songs/${songId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setSong(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching audio URL:', error);
                setError('Failed to load audio. Please try again later.');
                setLoading(false);
            }
        };

        fetchAudioUrl();
    }, [songId]);

    const toggleLyrics = () => {
        setShowFullLyrics(!showFullLyrics); // Đảo trạng thái giữa việc hiển thị toàn bộ hay một phần
    };

    return (
        <div>
            <Header/>
       <div className="audio-player-page">
    <div className="audio-player-container">
        {loading ? (
            <p>Loading audio...</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <>
                {song?.imgUrl && (
                    <img
                        src={song.imgUrl}
                        alt={`Cover for ${song.title}`}
                        className="song-image"
                    />
                )}
                <div className="song-info">
                    <div className="song-title">
                        <h2 className="now-playing">Now Playing: {song?.title || "Unknown Song"}</h2>
                    </div>
                    <AudioPlayer
                        autoPlay
                        src={song?.audioFileUrl}
                        onPlay={e => console.log('Playing audio')}
                        controls
                        className="audio-controls"
                    />
                    <div className="lyrics">
                        {song?.lyrics ? (
                            <>
                                {showFullLyrics || song.lyrics.length <= MAX_LYRICS_LENGTH ? (
                                    <p>{song.lyrics}</p>
                                ) : (
                                    <p>{song.lyrics.slice(0, MAX_LYRICS_LENGTH)}...</p>
                                )}
                                {song.lyrics.length > MAX_LYRICS_LENGTH && (
                                    <button onClick={toggleLyrics} className="toggle-lyrics-btn">
                                        {showFullLyrics ? 'Thu gọn' : 'Xem thêm'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>Unknown lyrics</p>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
</div>
<Footer/>
</div>
    );
};

export default AudioPlayerPage;
