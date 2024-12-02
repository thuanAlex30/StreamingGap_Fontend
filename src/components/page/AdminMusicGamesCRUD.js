import React, { useState, useEffect } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, TextField, Modal, Box, Typography 
} from '@mui/material';
import UserService from '../service/UserService';
import AdminPage from './Adminpage';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Header from '../common/Header';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function AdminMusicGamesCRUD() {
    const [musicGames, setMusicGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newGame, setNewGame] = useState({
        question_text: '',
        answer_1: '',
        answer_2: '',
        answer_3: '',
        answer_4: '',
        correct_answer: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentGameId, setCurrentGameId] = useState(null);

    useEffect(() => {
        const fetchMusicGames = async () => {
            try {
                setIsLoading(true);
                const response = await UserService.getAllMusicGames(localStorage.getItem('token'));
                setMusicGames(response.musicGameList || []);
            } catch (err) {
                setError(err.message || "Failed to load music games.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMusicGames();
    }, []);

    const handleDeleteGame = async (gameId) => {
        if (window.confirm("Are you sure you want to delete this music game?")) {
            try {
                const token = localStorage.getItem('token');
                await UserService.deleteMusicGame(gameId, token);
                setMusicGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete music game.");
            }
        }
    };

    const handleEditGame = (game) => {
        setNewGame(game);
        setIsEditing(true);
        setCurrentGameId(game.id);
        setModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGame((prev) => ({
            ...prev,
            [name]: name === 'correct_answer' ? Math.max(1, Math.min(4, Number(value))) : value,
        }));
    };

    const handleSaveGame = async () => {
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                const updatedGame = await UserService.updateMusicGame(currentGameId, newGame, token);
                setMusicGames((prevGames) =>
                    prevGames.map((game) => (game.id === updatedGame.id ? updatedGame : game))
                );
            } else {
                const createdGame = await UserService.createMusicGame(newGame, token);
                setMusicGames((prevGames) => [...prevGames, createdGame]);
            }
            resetModal();
        } catch (err) {
            setError(err.message || "Failed to save music game.");
        }
    };

    const handleImportData = async () => {
        if (!selectedFile) {
            setError("Please select a file to import.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const importedData = await UserService.importAndCreateMusicGames(selectedFile, token);
            setMusicGames((prevGames) => [...prevGames, ...importedData.musicGameList]);
            setSelectedFile(null);
        } catch (err) {
            setError(err.message || "Failed to import data.");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const resetModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setNewGame({
            question_text: '',
            answer_1: '',
            answer_2: '',
            answer_3: '',
            answer_4: '',
            correct_answer: '',
        });
        setError(null);
        setCurrentGameId(null);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div>
            <Header/>
        <div style={{ display: 'flex' }}>
            <AdminPage />
            <div style={{ width: '100%', padding: "23px" }}>
            <Typography variant="h4" gutterBottom>
                    Music Game Management
                </Typography>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {musicGames.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell>{game.id}</TableCell>
                                    <TableCell>{game.question_text}</TableCell>
                                    <TableCell>
                                        <Button 
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '8px' }}
                                        onClick={() => handleEditGame(game)}> Edit</Button>
                                        <Button 
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteGame(game.id)}> Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button onClick={() => setModalOpen(true)}><FaPlus /> Add New Game</Button>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <Button onClick={handleImportData}>Import Data</Button>

                <Modal open={modalOpen} onClose={resetModal}>
                    <Box sx={style}>
                        <Typography variant="h6">{isEditing ? "Edit Music Game" : "Add New Music Game"}</Typography>
                        <TextField
                            fullWidth
                            label="Question"
                            name="question_text"
                            value={newGame.question_text}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 1"
                            name="answer_1"
                            value={newGame.answer_1}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 2"
                            name="answer_2"
                            value={newGame.answer_2}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 3"
                            name="answer_3"
                            value={newGame.answer_3}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Answer 4"
                            name="answer_4"
                            value={newGame.answer_4}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Correct Answer (1-4)"
                            name="correct_answer"
                            value={newGame.correct_answer}
                            onChange={handleInputChange}
                            margin="normal"
                            type="number"
                        />
                        <Button onClick={handleSaveGame}>Save</Button>
                        <Button onClick={resetModal}>Cancel</Button>
                    </Box>
                </Modal>
            </div>
        </div>
        </div>
    );
}

export default AdminMusicGamesCRUD;
