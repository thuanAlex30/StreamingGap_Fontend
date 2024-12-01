import React, { useState, useEffect } from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import "./Header.css";
import Home from "@mui/icons-material/Home";
<<<<<<< HEAD

=======
>>>>>>> 405ee6a2678549cf25619f6c11b5cde660d0fd92
const Header = () => {
   const [profileInfo, setProfileInfo] = useState({});
   const [searchTitle, setSearchTitle] = useState("");
   const [songs, setSongs] = useState([]);
   const [filteredSongs, setFilteredSongs] = useState([]);
   const [error, setError] = useState(null);
   const [showInfo, setShowInfo] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      const fetchSongs = async () => {
         try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found.");
            const response = await UserService.getAllSongs(token);
            setSongs(response.songDtoList);
            setFilteredSongs(response.songDtoList);
         } catch (err) {
            console.error("Error fetching songs:", err);
            setError(err.message || "Failed to load songs.");
         }
      };
      fetchSongs();
   }, []);

   useEffect(() => {
      const fetchProfileInfo = async () => {
         try {
            const token = localStorage.getItem("token");
            if (!token) {
               throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
            }
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.user);
<<<<<<< HEAD
            console.log("hehe", response);
=======
            console.log(response);
   
>>>>>>> 405ee6a2678549cf25619f6c11b5cde660d0fd92
         } catch (error) {
            console.error("Error fetching profile information:", error.message || error);
         }
      };
      fetchProfileInfo();
   }, []);
<<<<<<< HEAD
=======
   
>>>>>>> 405ee6a2678549cf25619f6c11b5cde660d0fd92

   useEffect(() => {
      const filterSongs = () => {
         const filtered = songs.filter((song) =>
            song.title.toLowerCase().includes(searchTitle.toLowerCase())
         );
         setFilteredSongs(filtered);
      };
      filterSongs();
   }, [searchTitle, songs]);

   const handleLogout = () => {
      UserService.logout();
<<<<<<< HEAD
      navigate("/");
   };
   const toChatPage = () => {
      navigate("/chat");
   };
   const handleChoose = (song_id) => {
      navigate(`/song/${song_id}`);
   };
   const toggleProfileInfo = () => {
   setShowInfo(!showInfo);
};

   return (
      <Navbar bg="black" className="d-flex align-items-center flex navnav">
         <div style={{ color: "white" }}>StreamingGAP</div>
         <Nav className="flex" style={{ display: "flex", alignItems: "center" }}>
            <Nav.Link as={Link} to="/home" className="d-flex align-items-center me-3 navvlink">
=======
      navigate("/login");
   };
   const toChatPage = () =>{
      navigate('/chat')
   }
   const handleChoose = (song_id) => {
      navigate(`/song/${song_id}`);
   };

   const handleAvatarClick = () => {
      setShowInfo(!showInfo);
      console.log(showInfo);
      console.log(profileInfo);
      
      
   };

   return (
      <Navbar style={{height:'100px'}} bg="black" className="d-flex align-items-center flex navnav">
         <div style={{ color: "white" }}>StreamingGAP</div>
         <Nav className="flex" style={{ display: "flex", alignItems: "center" }}>
            <Nav.Link as={Link} to="/" className="d-flex align-items-center me-3 navvlink">
>>>>>>> 405ee6a2678549cf25619f6c11b5cde660d0fd92
               <Home style={{ color: "white" }} className="nav-con" />
            </Nav.Link>
            <Form className="form-search" style={{ display: "flex", alignItems: "center" }}>
               <FormControl
                  type="search"
                  placeholder="Bạn muốn phát nội dung gì?"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setSearchTitle(e.target.value)}
               />
               {searchTitle.length > 0 && (
                  <ul className="search">
                     {filteredSongs.map((hint, index) => (
                        <li key={index} onClick={() => handleChoose(hint.song_id)}>
                           <a>{hint.title}</a>
                        </li>
                     ))}
                  </ul>
               )}
            </Form>
            <Button variant="outline-light" className="me-3">
               Khám phá Premium
            </Button>
            <Nav.Link as={Link} to="#notifications" className="d-flex align-items-center me-3">
               <FaBell color="white" size={20} />
            </Nav.Link>
            <div className="userl" style={{ display: "flex", alignItems: "center" }}>
               {profileInfo ? (
                  <>
                     <img
<<<<<<< HEAD
                        src={profileInfo.avatar_url}
                        alt="User Avatar"
                        style={{
                           cursor: "pointer",
                           width: "50px",
                           height: "50px",
                           borderRadius: "50%",
                        }}
                        onClick={toggleProfileInfo} // Bắt sự kiện click
                     />

=======
                        onClick={handleAvatarClick}
                        src={profileInfo.avatar_url}
                        
                        // 
                        alt="User Avatar"
                     />
>>>>>>> 405ee6a2678549cf25619f6c11b5cde660d0fd92
                     {showInfo && (
                        <div className="profile-info">
                           <p>Email: {profileInfo.email}</p>
                           <p>Role: {profileInfo.role}</p>
                        </div>
                     )}
<<<<<<< HEAD
                     <Button variant="outline-light" onClick={toChatPage}>
                        Public chat
                     </Button>
                     <Button variant="outline-light" onClick={handleLogout}>
                        Logout
                     </Button>
                     <Button variant="outline-light" onClick={() => navigate("/localchat")}>
                        Local chat
                     </Button>
                     {/* Nút Profile */}
                     <Button variant="outline-light" onClick={() => navigate("/profileUser")}>
                        Profile
                     </Button>
=======
                     {/* Chat tổng  */}
                     <Button variant="outline-light" onClick={toChatPage}>Public chat</Button>
                     <Button variant="outline-light" onClick={handleLogout}>
                        Logout
                     </Button>
                     <Button onClick={()=>{navigate('/localchat')}} variant="outline-light" >Local chat</Button>
>>>>>>> 405ee6a2678549cf25619f6c11b5cde660d0fd92
                  </>
               ) : (
                  <Nav.Link as={Link} to="/login" className="d-flex align-items-center loginbutton">
                     <span className="login-text">Login</span>
                  </Nav.Link>
               )}
            </div>
         </Nav>
         {error && <div className="text-danger">{error}</div>} {/* Thông báo lỗi nếu có */}
      </Navbar>
   );
};

export default Header;