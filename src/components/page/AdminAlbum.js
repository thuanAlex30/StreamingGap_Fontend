import React, { useState, useEffect } from 'react';
import {
    Box, Button, CircularProgress, Grid, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Typography, Alert, Snackbar
} from '@mui/material';
import Axios from 'axios';
import UserService from '../service/UserService';
import AdminPage from './Adminpage';

const AdminAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        cover_image_url: '',
        release_date: '',
    });
    const [number, setNumber] = useState(0);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("User not authenticated. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await UserService.getAllAlbums(token); // Use UserService method
                
                if (response && response.albumList) {
                    setAlbums(response.albumList);
                } else {
                    setError("No albums found.");
                }
            } catch (err) {
                console.error("Failed to fetch albums:", err);
                setError("Failed to fetch albums. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [number]);
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateOrUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                title: formData.title,
                artist: { artist_id: formData.artist },
                cover_image_url: formData.cover_image_url,
                release_date: formData.release_date,
            };

            if (selectedAlbum) {
                await UserService.updateAlbum(selectedAlbum.album_id, payload, token);
            } else {
                await UserService.createAlbum(payload, token);
            }

            setNumber(number + 1);
            setSelectedAlbum(null);
            setFormData({ title: '', artist: '', cover_image_url: '', release_date: '' });
        } catch (err) {
            console.error("Error creating or updating album:", err);
            setError("Failed to create or update album. Please try again later.");
        }
    };

    const handleDelete = async (albumId) => {
        try {
            const token = localStorage.getItem('token');
        

            setAlbums(albums.filter((album) => album.album_id !== albumId));
        } catch (err) {
            console.error("Error deleting album:", err);
            setError("Failed to delete album. Please try again later.");
        }
    };

    const handleEdit = (album) => {
        setSelectedAlbum(album);
        setFormData({
            title: album.title,
            artist: album.artist ? album.artist.artist_id : '',
            cover_image_url: album.cover_image_url,
            release_date: album.release_date,
        });
    };

    return (
        <Box display="flex">
            <AdminPage />
            <Box flex={1} p={4}>
                <Typography variant="h4" gutterBottom>
                    Album Management
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
                                <Alert severity="error" onClose={() => setError(null)}>
                                    {error}
                                </Alert>
                            </Snackbar>
                        )}

                        <Box mb={4}>
                            <Typography variant="h6">{selectedAlbum ? 'Edit Album' : 'Create Album'}</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Artist ID"
                                        name="artist"
                                        value={formData.artist}
                                        onChange={handleFormChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Cover Image URL"
                                        name="cover_image_url"
                                        value={formData.cover_image_url}
                                        onChange={handleFormChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Release Date"
                                        name="release_date"
                                        value={formData.release_date}
                                        onChange={handleFormChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCreateOrUpdate}
                                    style={{ marginRight: '10px' }}
                                >
                                    {selectedAlbum ? 'Update Album' : 'Create Album'}
                                </Button>
                                {selectedAlbum && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedAlbum(null);
                                            setFormData({ title: '', artist: '', cover_image_url: '', release_date: '' });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Album ID</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Artist</TableCell>
                                        <TableCell>Cover Image</TableCell>
                                        <TableCell>Release Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {albums.length > 0 ? (
                                        albums.map((album) => (
                                            <TableRow key={album.album_id}>
                                                <TableCell>{album.album_id}</TableCell>
                                                <TableCell>{album.title}</TableCell>
                                                <TableCell>{album.artist?.name || 'Unknown'}</TableCell>
                                                <TableCell>
                                                    {album.cover_image_url && (
                                                        <img
                                                            src={album.cover_image_url}
                                                            alt={album.title}
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>{album.release_date}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEdit(album)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleDelete(album.album_id)}
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No albums found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AdminAlbum;
