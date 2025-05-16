import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';

import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';


import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';

import { withLoading } from '@app/hocs/withLoading.hoc';



import { UserProvider } from '../../Context/UserContext';
import { ProtectedRoute } from './ProtectedLayout';
import Students from '../../pages/30/Students';



const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));


const Logout = React.lazy(() => import('./Logout'));



// UI Components


// Maps

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

// Profile



const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
    const protectedLayout = (
        <ProtectedRoute>
            <MainLayout />
        </ProtectedRoute>

    );

    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path={'/'} element={protectedLayout}>
                        <Route index element={<Students />} />

                        <Route path="server-error" element={<ServerError />} />
                        <Route path="404" element={<Error404 />} />
                     
                    </Route>
                    <Route path="/auth" element={<AuthLayoutFallback />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    </Route>
                    <Route path="auth/logout" element={<LogoutFallback />} />

                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
};
