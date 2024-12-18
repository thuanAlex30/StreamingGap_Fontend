import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import UserService from '../service/UserService';
import '../css/SpotifyWebPlayer.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import UserAlbums from '../userspage/UserAlbum';

const SpotifyWebPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token not found.');

                const response = await UserService.getAllSongs(token);
                setSongs(response.songDtoList);
                setIsLoading(false);
                console.error(response.songDtoList);
            } catch (err) {
                console.error("Error fetching songs:", err);
                setError(err.message || "Failed to load songs.");
                setIsLoading(false);
            }
        };

      fetchSongs();
   }, []);

    const handleSongClick = (songId) => {
        navigate(`/song/${songId}`);
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

   if (isLoading) {
      return <p>Loading...</p>;
   }

   if (error) {
      return <p>{error}</p>;
   }

    return (
        <div>
            <Header/>
            
         
        <div className="player-container">
            <div className='mainb'>
                <UserAlbums/>
            </div>
            <div className='maina'>

            <div className="songs-grid">     
                <h2>Spotify Music Player</h2>
                <div className='listSong'>
<table>
<thead>
    <tr>
      <th></th>
      <th style={{margin:'0 auto'}}>Name Song</th>
      <th style={{margin:'0 auto'}}>Name User</th>
      <th style={{margin:'0 auto'}}>Type</th>
    </tr>
  </thead>
  <tbody>
                {songs.map(song => (
                    
                    <tr style={{marginBottom:'10px !important'}}  key={song.song_id || ""} className="song-card" onClick={() => handleSongClick(song.song_id)}>
                        <td><img
                            src={song.imgUrl} // Thay đổi theo thuộc tính bạn sử dụng cho ảnh bìa
                            alt={`${song.title}`}
                            // làm nhỏ lại
                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                        /></td>
                      <td style={{width:'450px'}}>  <h5 >{song.title || 'Untitled Song'}</h5></td>
                      <td style={{width:'250px'}} > <p>{song.createdByUsername || 'Unknown User'}</p></td>
                      <td style={{width:'250px'}} >  <p>{song.genre}</p></td>
                       
                    </tr>
                ))} </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        
        </div>
    );
};

export default SpotifyWebPlayer;
