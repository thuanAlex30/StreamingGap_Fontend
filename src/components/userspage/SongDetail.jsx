import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import UserService from "../service/UserService";

function SongDetail() {
   const { songId } = useParams();

   const [song, setSong] = useState(null); // Khởi tạo là null thay vì undefined
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchSong = async () => {
         try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found.");

            const response = await UserService.getSongId(songId, token);
            setSong(response);
            setIsLoading(false);
         } catch (err) {
            console.error("Error fetching songs:", err);
            setError(err.message || "Failed to load songs.");
            setIsLoading(false);
         }
      };

      fetchSong();
   }, [songId]);

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   if (!song) {
      return <div>No song found.</div>;
   }

   return (
      <div>
         <h3>Song Detail</h3>
         <h5>{song.title || "Untitled Song"}</h5>
         <p>{song.artist || 'Unknown Artist'}</p>
      </div>
   );
}

export default SongDetail;
