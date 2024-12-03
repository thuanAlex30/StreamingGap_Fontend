import React, { useState } from 'react';
import axios from 'axios';
import '../css/YoutubeSearch.css';
import '../css/Header.css';
import Header from '../common/Header'; 

const YouTubeSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Hàm tìm kiếm video trên YouTube
    const handleSearch = async () => {
        try {
            const searchQuery = query + " karaoke"; 

            let allVideos = []; 
            let fetchedVideosCount = 0;

            // Lặp cho đến khi có đủ 12 video nhúng
            while (fetchedVideosCount < 12) {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/search`,
                    {
                        params: {
                            part: 'snippet',
                            q: searchQuery,
                            key: process.env.REACT_APP_YOUTUBE_API_KEY,
                            maxResults: 12,
                        },
                    }
                );

                const videos = response.data.items || [];
                const embeddableVideos = await filterEmbeddableVideos(videos);

                allVideos = [...allVideos, ...embeddableVideos]; // Thêm vào danh sách kết quả
                fetchedVideosCount = allVideos.length;

            }

            setResults(allVideos.slice(0, 12)); 
            setError(null);
        } catch (err) {
            console.error('Error fetching YouTube videos', err);
            setError('Failed to fetch videos. Please try again.');
        }
    };

    // Hàm kiểm tra video có cho phép nhúng hay không
    const filterEmbeddableVideos = async (videos) => {
        const embeddableVideos = [];
        for (const video of videos) {
            const videoId = video.id.videoId;
            const detailedResponse = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos`,
                {
                    params: {
                        part: 'status',
                        id: videoId,
                        key: process.env.REACT_APP_YOUTUBE_API_KEY,
                    },
                }
            );

            const videoDetails = detailedResponse.data.items[0];
            if (videoDetails && videoDetails.status.embeddable) {
                embeddableVideos.push(video); // Thêm video vào danh sách nếu cho phép nhúng
            }
        }
        return embeddableVideos;
    };

    // Hàm xử lý khi người dùng chọn video
    const handleSelectVideo = (videoId) => {
        setSelectedVideo(videoId);
    };

    // Hàm đóng video khi nhấn vào khu vực tối mờ
    const handleOverlayClick = () => {
        setSelectedVideo(null); // Ẩn video khi nhấn vào overlay
    };

    return (
        <div>
            <Header/>
        
        <div className="youtube-search-container">
            <h1 className="title_ytb">YouTube Karaoke Search</h1>
<div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter song title and artist name"
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="results-container">
                {results.length > 0 ? (
                    results.map((video) => {
                        const { id, snippet } = video;
                        return (
                            <div
                                key={id.videoId}
                                className="video-card"
                                onClick={() => handleSelectVideo(id.videoId)}
                            >
                                <img
                                    src={snippet.thumbnails.medium.url}
                                    alt={snippet.title}
                                    className="video-thumbnail"
                                />
                                <div className="video-info">
                                    <h3>{snippet.title}</h3>
                                    <p>{snippet.description}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No embeddable results found. Try another search!</p>
                )}
            </div>

            {selectedVideo && (
                <div className="overlay" onClick={handleOverlayClick}>
                    <div className="video-container">
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${selectedVideo}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default YouTubeSearch;