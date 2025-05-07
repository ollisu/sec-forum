import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = () => {
    const { isLoggedIn, loading } = useAuth();

    if(loading) return <div>loading...</div>

    return (
        isLoggedIn ? <Outlet /> : <Navigate to="/" replace /> 
    );

};

export default PrivateRoute;