import React, { createContext, useState } from 'react';

// Tạo context
export const SessionContext = createContext();

// Tạo provider để quản lý sessionId
export const SessionProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState(null); // Khởi tạo sessionId là null

    // Hàm để cập nhật sessionId
    const updateSessionId = (id) => {
        setSessionId(id);
    };

    return (
        <SessionContext.Provider value={{ sessionId, updateSessionId }}>
            {children} {/* Dùng để bao bọc các component con */}
        </SessionContext.Provider>
    );
};
