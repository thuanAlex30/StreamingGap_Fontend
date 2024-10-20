import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import SpotifyWebPlayer from './components/page/SpotifyWebPlayer';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                {/*<Navbar />*/}
                <div className="content">
                    <Routes>
                        <Route exact path="/" element={<LoginPage />} />
                        <Route exact path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        {UserService.adminOnly() && (
                            <>

                                <Route path="/admin/user-management" element={<UserManagementPage />} />
                                <Route path="/update-user/:userId" element={<UpdateUser />} />
                            </>
                        )}

                        {/* Chỉ hiển thị SpotifyWebPlayer khi người dùng đã đăng nhập */}
                        <Route path="/spotify" element={UserService.isAuthenticated() ? <SpotifyWebPlayer /> : <Navigate to="/login" />} />

                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
                {/*<FooterComponent />*/}
            </div>
        </BrowserRouter>
    );
}

export default App;
