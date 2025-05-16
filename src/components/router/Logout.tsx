// src/components/auth/Logout.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { Spin } from 'antd';

const Logout: React.FC = () => {
    const { logoutUser } = useUser();
    const [done, setDone] = useState(false);

    useEffect(() => {
        const doLogout = async () => {
            try {
                await logoutUser();
            } finally {
                setDone(true);
            }
        };
        doLogout();
    }, [logoutUser]);

    if (done) {
        return <Navigate to="/auth/login" replace />;
    }

    // Centered spinner overlay
    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                zIndex: 1000,
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Spin size="large" tip="Logging out..." />
            </div>
        </div>
    );
};

export default Logout;
