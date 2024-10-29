import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';
import ChatPage  from './components/page/Chatpage';


function App() {
    return (
        <BrowserRouter>
            {/*<Header/>*/}
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route exact path="/" element={<LoginPage />} />
                        <Route exact path="/profile" element={<SpotifyWebPlayer />} />
                        <Route exact path="/chat" element={<ChatPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
