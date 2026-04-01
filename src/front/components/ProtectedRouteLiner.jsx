import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const ProtectedRouteLiner = ({ children }) => {
    const { store } = useGlobalReducer();

    if (!store.authLiner) {
        return <Navigate to="/liner/login" replace />;
    }

    return children ? children : <Outlet />;
};