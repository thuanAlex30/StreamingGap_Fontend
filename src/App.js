import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';
import ChatPage  from './components/page/Chatpage';

import { useState } from 'react';
import AudioPlayerPage from './components/userspage/AudioPlayerPage';


function App() {
    // const [songdetail, setSongdetail] = useState();
    return (
        <BrowserRouter>
            {/*<Header/>*/}
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route exact path="/" element={<LoginPage />} />
                        <Route exact path="/profile" element={<SpotifyWebPlayer />} />
                        <Route exact path="/chat" element={<ChatPage />} />
<Route path="/song/:songId" element={<AudioPlayerPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
