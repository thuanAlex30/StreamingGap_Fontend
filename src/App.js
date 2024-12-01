import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';
import ChatPage  from './components/page/Chatpage';
import UpdateUser from './components/userspage/UpdateUser';
import { useState } from 'react';
import AudioPlayerPage from './components/userspage/AudioPlayerPage';
import Chatcon from './components/page/Chatcon';
import ProfilePage from './components/userspage/ProfilePage';


function App() {
    // const [songdetail, setSongdetail] = useState();
    return (
        <BrowserRouter>
            {/*<Header/>*/}
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path='/updateUser' element={<UpdateUser/>}/>
                        <Route path='/profileUser' element={<ProfilePage/>}/>
                        <Route exact path="/" element={<LoginPage />} />
                        <Route exact path="/home" element={<SpotifyWebPlayer />} />
                        <Route path="/song/:songId" element={<AudioPlayerPage />} />
                        <Route path='/localchat' element={<Chatcon/>} />
                        <Route exact path="/chat" element={<ChatPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
