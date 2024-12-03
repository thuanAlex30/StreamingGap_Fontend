import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import UserService from '../service/UserService';
import '../css/Header.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CommentService from '../service/CommentService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AudioPlayerPage = () => {
    const { songId } = useParams();
    const [song, setSong] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullLyrics, setShowFullLyrics] = useState(false);
    const [sleepTimer, setSleepTimer] = useState(); // Thời gian hẹn giờ
    const [timerId, setTimerId] = useState(null); // Lưu ID của bộ đếm giờ
    const audioPlayerRef = useRef(null); // Tham chiếu đến AudioPlayer
    const [isPremium, setIsPremium] = useState(false); // Kiểm tra gói đăng ký của người dùng
    const [isAdPlaying, setIsAdPlaying] = useState(false); // Trạng thái quảng cáo đang phát hay không
    const MAX_LYRICS_LENGTH = 200;
    
    useEffect(() => {
        
        const fetchAudioUrl = async () => {
            try {
                const token = localStorage.getItem('token');
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

                const commentResponse = await CommentService.getCommentsBySongId(songId, token);
                setComments(commentResponse.commentList || []);

                // Check if the user has a Premium subscription
                const premiumResponse = await axios.get('http://localhost:1010/subscription/isPremium', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsPremium(premiumResponse.data); // Cập nhật trạng thái đăng ký

            } catch (error) {
                console.error('Error fetching audio URL:', error);
                setError('Failed to load audio. Please try again later.');
                setLoading(false);
            }
        };

        fetchAudioUrl();
    }, [songId]);

    const handleSleepTimerChange = (e) => {
        const value = e.target.value;
        if (value === "" || value <= 0) {
            setSleepTimer();
        } else {
            setSleepTimer(value); // Cập nhật thời gian hẹn giờ
        }
    };

    const startSleepTimer = () => {
        if (sleepTimer <= 0) {
            toast.error("Please enter a valid time for the sleep timer.");
            return;
        }

        if (timerId) {
            clearTimeout(timerId); // Xóa bộ đếm giờ cũ nếu tồn tại
        }

        const id = setTimeout(() => {
            if (audioPlayerRef.current) {
                audioPlayerRef.current.audio.current.pause(); // Dừng nhạc
            }
            toast.success("Sleep timer has ended. Music has stopped.");
        }, sleepTimer * 60000); // Tính theo phút

        setTimerId(id);
        toast.info(`Sleep timer has been set for ${sleepTimer} minute(s).`);
    };

    const toggleLyrics = () => {
        setShowFullLyrics(!showFullLyrics);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = UserService.getToken();
        if (!token) {
            alert("You must be logged in to comment.");
            return;
        }

        try {
            const newComment = { songId, content };
            const createdComment = await CommentService.createComment(newComment, token);

            // Sau khi gửi thành công, tải lại trang để cập nhật comments
            window.location.reload();  // Tự động tải lại trang

        } catch (err) {
            console.error("Error creating comment:", err);
        }
    };

    

    // const handleCommentChange = (e) => {
    //     setContent(e.target.value);
    //     // Điều chỉnh chiều cao của textarea
    //     e.target.style.height = 'auto'; // Đặt chiều cao về mặc định
    //     e.target.style.height = `${e.target.scrollHeight}px`; // Đặt chiều cao theo nội dung
    // };


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

const handleSongEnd = () => {
    // Kiểm tra xem người dùng có đăng ký gói Premium không
    if (!isPremium && !isAdPlaying) {
        setIsAdPlaying(true);
        const audio = new Audio("https://res.cloudinary.com/dcnrwyzcv/video/upload/v1732971603/Music/k8lidmevt2klkw1wodib.mp3");
        
        audio.volume = audioPlayerRef.current.audio.current.volume;

        audio.play();

        audio.onended = () => {
            setIsAdPlaying(false);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.audio.current.play(); // Phát lại nhạc
            }
        };
    }
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
                        ref={audioPlayerRef}
                        autoPlay
                        src={song?.audioFileUrl}
                        onPlay={e => console.log('Playing audio')}
                        controls
                        className="audio-controls"
                        onEnded={handleSongEnd}
                        disabled={isAdPlaying}
                    />
                    <div style={{display:'flex',width:'600px',margin:'10px',padding:'10px !important'}} className="sleep-timer">
                        <label>
                            Sleep Timer *minutes:
                            <input
                                type="number"
                                min="1"
                                value={sleepTimer}
                                onChange={handleSleepTimerChange}
                            />
                        </label>
                        <button style={{display:'block',backgroundColor:'green'}} onClick={startSleepTimer}>Start Timer</button>
                        <ToastContainer />
                    </div>
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
