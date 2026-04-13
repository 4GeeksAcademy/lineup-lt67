import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const ProtectedRouteEstablecimiento = ({ children }) => {
    const { store } = useGlobalReducer();

    if (!store.authEstablecimiento) {
        return <Navigate to="/establecimiento/login" replace />;
    }

    return children ? children : <Outlet />;
};