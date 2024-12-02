import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import UserService from '../service/UserService';  // Assuming you have a UserService to fetch song details
import Header from '../common/Header';

const MusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [audio] = useState(new Audio());

    // Fetch songs from the API when the component loads
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songData = await UserService.getAllSongs();
                setSongs(songData.songDtoList);
            } catch (err) {
                console.error('Error fetching songs:', err);
            }
        };

        fetchSongs();
    }, []);

    // Handle playing the selected song
    const playSong = (song) => {
        if (currentSong?.song_id !== song.song_id) {
            audio.src = song.audio_file_url;
            setCurrentSong(song);
            audio.play();
            setIsPlaying(true);
        } else {
            isPlaying ? audio.pause() : audio.play();
            setIsPlaying(!isPlaying);
        }
    };

    // Update the volume of the audio element
    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        audio.volume = newValue;
    };

    useEffect(() => {
        // Listen to the end of song playback and reset the state
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, [audio]);

    return (
        <div>

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: '#fff',
                padding: '20px'
            }}
        >
            <Typography variant="h4" gutterBottom>
                Music Player
            </Typography>

            <Box sx={{ width: '100%', maxWidth: '600px' }}>
                {songs.length > 0 ? (
                    songs.map((song) => (
                        <Box key={song.song_id} sx={{ marginBottom: '20px' }}>
                            <Typography variant="h6">{song.title}</Typography>
                            <Typography variant="body2">{song.album || 'Unknown Album'}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={isPlaying && currentSong?.song_id === song.song_id ? <PauseIcon /> : <PlayArrowIcon />}
                                onClick={() => playSong(song)}
                            >
                                {isPlaying && currentSong?.song_id === song.song_id ? 'Pause' : 'Play'}
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Typography>No songs available.</Typography>
                )}
            </Box>

            {currentSong && (
                <Box sx={{ marginTop: '40px', textAlign: 'center' }}>
                    <Typography variant="h5">Now Playing</Typography>
                    <Typography variant="h6">{currentSong.title}</Typography>
                    <Typography variant="body2">{currentSong.album || 'Unknown Album'}</Typography>
                    <Box sx={{ width: '80%', marginTop: '20px' }}>
                        <VolumeUpIcon />
                        <Slider
                            value={volume}
                            onChange={handleVolumeChange}
                            step={0.01}
                            min={0}
                            max={1}
                            sx={{ color: '#fff' }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
        </div>
    );
};

export default MusicPlayer;
