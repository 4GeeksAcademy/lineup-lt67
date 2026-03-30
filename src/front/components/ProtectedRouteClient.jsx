import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const ProtectedRouteClient = ({ children }) => {
    const { store } = useGlobalReducer();

    if (!store.authClient) {
        return <Navigate to="/client/login" replace />;
    }

    return children ? children : <Outlet />;
};