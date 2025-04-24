import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = () => {
    const { isLoggedIn } = useAuth();

    return (
        isLoggedIn ? <Outlet /> : <Navigate to="/" /> 
    );

};

export default PrivateRoute;