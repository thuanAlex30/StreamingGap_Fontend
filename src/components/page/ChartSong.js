import React, { useEffect, useState, useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import AdminPage from "./Adminpage";
import UserService from "../service/UserService";
import '../css/Chart.css'
export default function ChartSong() {
   const [songList, setSongList] = useState([]);
   const [series, setSeries] = useState([{ data: [] }]);
   const [tittle, setTittle] = useState([]);
   const token = localStorage.getItem("token");

   useEffect(() => {
      UserService.getAllSongs(token)
         .then((results) => {
            setSongList(results.songDtoList);
         })
         .catch((error) => {
            console.log(error);
         });
   }, [token]);

   const chartData = useMemo(() => {
      if (songList.length > 0) {
         const listenCounts = songList.map((item) => item.listen_count);
         const tittleSong = songList.map((item) => item.title);

         setSeries([
            {
               name: "Lượt nghe bài hát",
               data: listenCounts,
               color: "#FF5733",
            },
         ]);
         setTittle(tittleSong);
      }
   }, [songList]);

   return (
      <div style={styles.container}>
         <div style={styles.sidebar}>
            <AdminPage />
         </div>
         <div style={styles.chartWrapper}>
            <h2 style={styles.chartTitle}>Lượt Nghe Bài Hát</h2>
            <LineChart
               
               series={series}
               height={300}
               margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
               xAxis={[{ data: tittle, scaleType: "band" }]}
            />
         </div>
      </div>
   );
}

const styles = {
   container: {
      display: "flex",
      // backgroundColor: "#f9f9f9",
      // minHeight: "100vh",
      // padding: "20px",
   },
   // sidebar: {
   //    flex: "0 0 250px",
   //    marginRight: "20px",
   //    backgroundColor: "#fff",
   //    borderRadius: "8px",
   //    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
   //    padding: "20px",
   // },
   chartWrapper: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "20px",
   },
   chartTitle: {
      marginBottom: "20px",
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#333",
   },
};
