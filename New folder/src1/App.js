import React from 'react';
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

function App() {
    return (
        <SessionProvider>
        <BrowserRouter>
            {/* <Header setSongdetail={setSongdetail}/> */}
            <div className="App">
                <div className="content">
                <Routes>
                <Route path='/localchat' element={<ChatCon/>} />
                <Route exact path="/chat" element={<ChatPage />} />
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/home" element={<SpotifyWebPlayer />} />
                            <Route path="/song/:songId" element={<AudioPlayerPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/verify" element={<VerifyCodePage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                        </Routes>
                </div>
            </div>
        </BrowserRouter>
        </SessionProvider>
    );
}

export default App;
