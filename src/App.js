import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';
import AudioPlayerPage from './components/userspage/AudioPlayerPage';
import RegisterPage from './components/userspage/RegisterPage';
import VerifyCodePage from './components/userspage/VerifyCodePage';
import ForgotPasswordPage from './components/userspage/ForgotPasswordPage';
import ResetPasswordPage from './components/userspage/ResetPasswordPage';
import ChatCon from './components/page/ChatCon';
import ChatPage from './components/page/ChatPage';
import { SessionProvider } from './components/context/SessionContext';

import ImportMusicGames from './components/page/ImportMusicGames';
import AdminMusicGamesCRUD from './components/page/AdminMusicGamesCRUD';
import AdminUser from './components/page/AdminUser';
import SongManager from './components/page/AdminSongs';
import ArtistManagement from './components/page/AdminArtist';
import UserService from './components/service/UserService';
import ProfilePage from './components/userspage/ProfilePage';
import AdminPage from './components/page/Adminpage';
import AdminAlbum from './components/page/AdminAlbum';
import ChartSong from './components/page/ChartSong';
import UserAlbums from './components/page/UserAlbums';
import UpdateUser from './components/userspage/UpdateUser';
function App() {
    const [profileInfo, setProfileInfo] = useState({});
    useEffect(() => {
        const fetchProfileInfo = async () => {
           try {
              const token = localStorage.getItem("token");
              if (!token) {
                 throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
              }
              const response = await UserService.getYourProfile(token);
              setProfileInfo(response.user);
              console.log(response);
     
           } catch (error) {
              console.error("Error fetching profile information:", error.message || error);
           }
        };
        fetchProfileInfo();
     }, []);

    return (
        <SessionProvider>
        <BrowserRouter>
            {/* <Header setSongdetail={setSongdetail}/> */}
            <div className="App">
                <div className="content">
                <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/home" element={<SpotifyWebPlayer />} />
                            <Route path="/song/:songId" element={<AudioPlayerPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/verify" element={<VerifyCodePage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path='/albummm' element={<UserAlbums/>}></Route>
       
                        <Route path='/updateUser' element={<UpdateUser/>}/>
                        <Route path='/profileUser' element={<ProfilePage/>}/>
                        {/* <Route path="/song/:songId" element={<AudioPlayerPage />} /> */}
                        <Route path='/localchat' element={<ChatCon/>} />
                        <Route exact path="/chat" element={<ChatPage />} />
                        <Route exact path="/musicgame" element={<ImportMusicGames />} />
                      
                        {/* admin */}
                        <Route path='/chart' element={<ChartSong/>}/>
                        <Route path='/admin/album' element={<AdminAlbum/>}/>
                        <Route path='/adminpage' element={<AdminPage/> } />
               
                        <Route exact path="/admin/musicgames" element={<AdminMusicGamesCRUD />} />
                        <Route exact path="/admin/managementeUser" element={<AdminUser />} />  {/*done*/}
                        <Route exact path="/admin/managementSongs" element={<SongManager />} />
                        <Route exact path="/admin/managementArtist" element={<ArtistManagement />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
        </SessionProvider>
    );
}

export default App;
