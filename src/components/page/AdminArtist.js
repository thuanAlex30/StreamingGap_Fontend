import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Paper,
    Avatar,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AdminPage from './Adminpage';

function AdminArtistCRUD() {
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentArtist, setCurrentArtist] = useState(null);
    const [newArtist, setNewArtist] = useState({
        name: '',
        bio: '',
        profile_image_url: '',
        created_at: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setIsLoading(true);
                const response = await UserService.getAllArtists(localStorage.getItem('token'));
                setArtists(response.artistList || []);
            } catch (err) {
                setError(err.message || "Failed to load artists.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtists();
    }, []);

    const handleDeleteArtist = async (artistId) => {
        if (window.confirm("Are you sure you want to delete this artist?")) {
            try {
                const token = localStorage.getItem('token');
                await UserService.deleteArtist(artistId, token);
                setArtists((prevArtists) => prevArtists.filter((artist) => artist.artist_id !== artistId));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete artist.");
            }
        }
    };

    const handleEditArtist = (artist) => {
        setCurrentArtist(artist);
        setNewArtist({
            name: artist.name,
            bio: artist.bio || '',
            profile_image_url: artist.profile_image_url || '',
            created_at: artist.created_at
        });
        setIsEditing(true);
        setDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewArtist((prevArtist) => ({ ...prevArtist, [name]: value }));
    };

    const validateNewArtist = () => {
        const { name, bio, profile_image_url } = newArtist;
        return name && bio && profile_image_url;
    };

    const handleSaveArtist = async () => {
        if (!validateNewArtist()) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (isEditing && currentArtist) {
                const updatedArtist = await UserService.updateArtist(currentArtist.artist_id, newArtist, token);
                setArtists((prev) =>
                    prev.map((artist) => (artist.artist_id === updatedArtist.artist_id ? updatedArtist : artist))
                );
            } else {
                const createdArtist = await UserService.createArtist(newArtist, token);
                setArtists((prev) => [...prev, createdArtist]);
            }
            resetDialog();
        } catch (err) {
            setError(err.message || "Failed to save artist.");
        }
    };

    const resetDialog = () => {
        setDialogOpen(false);
        setCurrentArtist(null);
        setIsEditing(false);
        setNewArtist({ name: '', bio: '', profile_image_url: '', created_at: '' });
        setError(null);
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <div style={{ display: 'flex' }}>
            <AdminPage />
            <Container>
                <Typography variant="h4" gutterBottom>Artist Management</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Picture</TableCell>
                                <TableCell>Bio</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {artists.map((artist) => (
                                <TableRow key={artist.artist_id}>
                                    <TableCell>{artist.artist_id}</TableCell>
                                    <TableCell>{artist.name}</TableCell>
                                    <TableCell>
                                        <Avatar src={artist.profile_image_url} alt={artist.name} />
                                    </TableCell>
                                    <TableCell>{artist.bio || 'No bio available'}</TableCell>
                                    <TableCell>{new Date(artist.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="contained"
                                                    color="primary" 
                                                    style={{ marginRight: '8px' }}
    
                                                    onClick={() => handleEditArtist(artist)}>
                                            Edit 
                                        </Button>
                                        <Button variant="contained"
                                                    color="secondary" onClick={() => handleDeleteArtist(artist.artist_id)}>
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
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    Create New Artist
                </Button>

                <Dialog open={dialogOpen} onClose={resetDialog}>
                    <DialogTitle>{isEditing ? 'Edit Artist' : 'Create New Artist'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            name="name"
                            value={newArtist.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Bio"
                            name="bio"
                            value={newArtist.bio}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Profile Image URL"
                            name="profile_image_url"
                            value={newArtist.profile_image_url}
                            onChange={handleInputChange}
                        />
                        {isEditing && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Created At"
                                value={new Date(newArtist.created_at).toLocaleDateString()}
                                disabled
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetDialog} color="secondary">Cancel</Button>
                        <Button onClick={handleSaveArtist} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}

export default AdminArtistCRUD;
