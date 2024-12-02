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

        const response = await UserService.getAllAlbum(token);
        console.log("Fetched albums:", response?.albumList || []);
        
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
      <div key={album.album_id} style={styles.albumCard}>
        <h2 style={styles.albumTitle}>{album.title}</h2>
      </div>
    ));
  };

  if (loading) {
    return <div style={styles.loading}>Loading albums...</div>;
  }

  if (albums.length === 0 && !loading && !error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>All Album List:</h2>
        <p style={styles.emptyMessage}>No albums found.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>All Album List:</h2>
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
    marginTop: '10px',
  },
  emptyMessage: {
    color: '#888',
    fontStyle: 'italic',
  },
  albumList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
  },
  albumCard: {
    border: '1px solid #ccc',
    padding: '5px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  albumTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 'lighter',
  },
};
