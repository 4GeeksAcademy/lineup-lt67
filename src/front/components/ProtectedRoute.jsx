import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const ProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    if (!store.authAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children ? children : <Outlet />;
};