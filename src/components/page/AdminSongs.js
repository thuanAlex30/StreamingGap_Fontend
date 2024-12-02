import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import AdminPage from './Adminpage';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    TextField, Typography, Box, CircularProgress, Modal
} from '@mui/material';
import Header from '../common/Header';

const SongManager = () => {
    const [songs, setSongs] = useState([]);
    const [song, setSong] = useState({
        title: '',
        artist: '',
        album: '',
        url: '',
        genre: '',
        duration: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const token = localStorage.getItem('token');
    const [refresh, setRefresh] = useState(0);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAllSongs(token);
            if (data?.songDtoList && Array.isArray(data.songDtoList)) {
                setSongs(data.songDtoList);
            } else {
                setError('Unexpected data format');
            }
        } catch (err) {
            setError('Failed to load songs. Please try again later.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSongs();
    }, [refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSong((prevSong) => ({ ...prevSong, [name]: value }));
    };

    const handleCreateSong = async () => {
        try {
            const payload = {
                title: song.title,
                lyrics: song.artist,
                genre: song.genre,
                duration: song.duration,
                audio_file_url: song.url,
                album: { albumId: song.album },
            };
            await UserService.createSong(payload, token);
            setRefresh(refresh + 1);
            setOpenModal(false); // Close modal after successful creation
            setSong({ title: '', artist: '', album: '', url: '', genre: '', duration: '' }); // Clear form
        } catch (err) {
            setError('Failed to create song. Please try again later.');
        }
    };

    const handleDeleteSong = async (id) => {
        try {
            await UserService.deleteSong(id, token);
            setRefresh(refresh + 1);
        } catch (err) {
            setError('Failed to delete song. Please try again later.');
        }
    };

    return (
        <div>
            <Header/>
        <Box sx={{ display: 'flex', gap: 4 }}>
            <AdminPage />
            <Box sx={{ flexGrow: 1 ,    padding: "8px"}}>
                <Typography variant="h4" gutterBottom>
                    Song Management
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer component={Paper} sx={{ mb: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Album</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Lyrics</TableCell>
                                        <TableCell>URL</TableCell>
                                        <TableCell>Genre</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {songs.map((song) => (
                                        <TableRow key={song.song_id}>
                                            <TableCell>{song.song_id}</TableCell>
                                            <TableCell>{song.album?.albumId || 'N/A'}</TableCell>
                                            <TableCell>{song.title}</TableCell>
                                            <TableCell>{song.lyrics}</TableCell>
                                            <TableCell>{song.audio_file_url}</TableCell>
                                            <TableCell>{song.genre}</TableCell>
                                            <TableCell>{song.duration}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDeleteSong(song.song_id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenModal(true)}
                            sx={{ mb: 2 }}
                        >
                            Add New Song
                        </Button>

                        {/* Modal for Creating Song */}
                        <Modal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            aria-labelledby="create-song-modal"
                            aria-describedby="create-song-form"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 2,
                                }}
                            >
                                <Typography id="create-song-modal" variant="h6" component="h2" gutterBottom>
                                    Add New Song
                                </Typography>
                                <Box
                                    component="form"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={song.title}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Lyrics"
                                        name="artist"
                                        value={song.artist}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Album ID"
                                        name="album"
                                        value={song.album}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="URL"
                                        name="url"
                                        value={song.url}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Genre"
                                        name="genre"
                                        value={song.genre}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Duration (in seconds)"
                                        name="duration"
                                        type="number"
                                        value={song.duration}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCreateSong}
                                    >
                                        Create Song
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </>
                )}
            </Box>
        </Box>
        </div>
    );
};

export default SongManager;
