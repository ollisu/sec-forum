import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = () => {
    const { isLoggedIn, loading } = useAuth();

    if(loading) return       
       <div style={{ 
            width: "100vw", 
            minHeight: "100vh", 
            backgroundColor: "#f4f4f9", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "1.5rem", 
            fontFamily: "'Roboto', sans-serif", 
            color: "#444" 
          }}>
            Loading...
          </div>

    return (
        isLoggedIn ? <Outlet /> : <Navigate to="/" replace /> 
    );

};

export default PrivateRoute;