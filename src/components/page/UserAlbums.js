import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';

export default function UserAlbums() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await UserService.getAllAlbums(token);
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
  }, []);

  const renderAlbums = () => {
    return albums.map(album => (
      <div  key={album.album_id} style={styles.albumCard}>
        <h2 style={styles.albumTitle}>{album.title}</h2>
      </div>
    ));
  };

  if (loading) {
    return <div style={styles.loading}>Loading albums...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Album List:</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.albumList}>
        {renderAlbums()}
      </div>
    </div>
  );
}

// Inline styles object
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '24px',
    marginBottom: '15px',
  },
  loading: {
    fontSize: '18px',
    color: '#888',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  albumList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  albumCard: {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    width:"200px",
    maxHeight:"70px"
  },
  albumTitle: {
    margin: 0,
    fontSize: '20px',
  },
  artistName: {
    margin: '5px 0',
    fontStyle: 'italic',
  },
};
