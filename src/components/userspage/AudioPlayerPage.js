import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import UserService from '../service/UserService';
import '../css/Header.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CommentService from '../service/CommentService';
const AudioPlayerPage = () => {
    const { songId } = useParams();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullLyrics, setShowFullLyrics] = useState(false); // Trạng thái để kiểm soát việc hiển thị toàn bộ lời bài hát
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const MAX_LYRICS_LENGTH = 200; // Giới hạn số ký tự hiển thị ban đầu
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchAudioUrl = async () => {
            try {
              
                if (!token) {
                    throw new Error('Token not found. Please login again.');
                }

                const response = await axios.get(`http://localhost:1010/songs/${songId}`, {
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

        CommentService.getCommentsBySongId(songId, token).then((results)=>{
            console.log(results);
            setComments(results.commentList || []);
        }).catch((error) => {
            console.error("Error fetching comments by song:", error);
        })


        fetchAudioUrl();
    }, [songId,comments]);
    const formatCommentTime = (date) => {
        const now = new Date();
        const distance = now - new Date(date);
        const minutes = Math.floor(distance / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to comment.");
            return;
        }

        try {
            const newComment = { songId, content };
            const createdComment = await CommentService.createComment(newComment, token);
            setComments([...comments, createdComment]);
            setContent('');
        } catch (err) {
            console.error("Error creating comment:", err);
        }
    }
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
{/* comment */}
<div
    className="commentsite"
    style={{
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    }}
>
    <div
        className="comments-header"
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
        }}
    >
        <span
            className="comments-count"
            style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
            }}
        >
            {comments.length} comments
        </span>
    </div>

    <ul
        className="comments-list"
        style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '150px', // Chiều cao tối đa trước khi cuộn
            overflow: 'auto', 
        }}
    >
        {comments.map((comment, index) => (
            <li
                key={index}
                className="comment-item"
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e0e0e0',
                  
                }}
            >
                <img
                    src={comment.userAvatar || '/default-avatar.png'}
                    alt="User Avatar"
                    className="comment-avatar"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '15px',
                        objectFit: 'cover',
                        border: '2px solid #ddd',
                    }}
                />
                <div
                    className="comment-content"
                    style={{
                        flex: 1,
                    }}
                >
                    <div
                        className="comment-header"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <strong>{comment.username}</strong>
                        <span
                            className="comment-timestamp"
                            style={{
                                fontSize: '12px',
                                color: '#888',
                            }}
                        >
                            {comment.createdAt
                                ? formatCommentTime(comment.createdAt)
                                : 'Unknown time'}
                        </span>
                    </div>
                    <p style={{ margin: '5px 0' }}>{comment.content}</p>
                </div>
            </li>
        ))}
    </ul>
    <form
    onSubmit={handleCommentSubmit}
    className="comment-form"
    style={{
        marginTop: '20px',
    }}
>
    <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        required
        maxLength={500} // Giới hạn số ký tự, ví dụ: 500
        className="comment-textarea"
        style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
        }}
    />
    <button
        type="submit"
        className="comment-submit-button"
        style={{
            marginTop: '10px',
            padding: '10px 15px',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
        }}
    >
        Submit
    </button>
</form>

</div>

</div>
    );
};

export default AudioPlayerPage;
