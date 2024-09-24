// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/auth/LoginPage';
import UserService from './components/service/UserService';
import ProfilePage from './components/userspage/ProfilePage';




function App() {

  return (
      <BrowserRouter>
        <div className="App">
          <div className="content">
            <Routes>
              <Route exact path="/" element={<LoginPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Check if user is authenticated and admin before rendering admin-only routes */}

            </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;
