import React, { useContext, createContext, useState, useEffect} from 'react'
import { jwtDecode } from "jwt-decode";
import axios from '../api/axios';
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();


// This function encrypts the user data using AES-GCM encryption
// and returns the encrypted data as a base64 string.
// Not needed in the final version, but kept for reference.
const encryptData = async (data) => {
    const key = import.meta.env.VITE_SECRET_KEY;
    const encodedData = new TextEncoder().encode(JSON.stringify(data)); // Encrypt the entire user object

    // Hash the secret key to derive an AES-GCM key
    const hash = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
    const cryptoKey = await window.crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt']);

    // Generate a random IV (12 bytes recommended for AES-GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encodedData
    );

    // Combine IV and encrypted data into one buffer
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Encode to base64
    return btoa(String.fromCharCode(...combined));
};

// This function decrypts the encrypted data using AES-GCM decryption
// and returns the original user data as a JSON object.
// Not needed in the final version, but kept for reference.
const decryptData = async (ciphertext) => {
    const key = import.meta.env.VITE_SECRET_KEY;

    // Decode base64 string to bytes
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    // Hash the key and import it
    const hash = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
    const cryptoKey = await window.crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['decrypt']);

    // Decrypt
    const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedData
    );

    return JSON.parse(new TextDecoder().decode(decryptedData)); // Decrypt and parse as JSON object
};

export const AuthProvider = ({children}) => {


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser]= useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {

        const tryRefreshToken = async () => {
            if(location.pathname === '/'){
                setIsLoggedIn(false);
                return;
            }
            try {
                const res = await axios.post('/auth/refresh_token');
                const { accessToken } = res.data;
                const decoded_user = jwtDecode(accessToken);
                setUser(decoded_user);
                setAccessToken(accessToken);
                setIsLoggedIn(true);                
            } catch (err) {
                console.error('No valid session found:', err);  
                setIsLoggedIn(false);
                setUser(null);
                setAccessToken(null);    
                if (location.pathname !== '/') {
                    navigate('/');
                  }        
            } finally {
                setLoading(false);
            }
        };
        tryRefreshToken();
    }, []);

    const handleLogin = async (accessToken) => {
        try {
            const decoded_user = jwtDecode(accessToken);
            setUser(decoded_user);
            setAccessToken(accessToken);
            setIsLoggedIn(true);
            setLoading(false);
        } catch (err) {
            console.log("Login failed!!")            
        }
    }

    const handleLogout = async() => {
        try {
            await axios.post('/auth/logout');            
        } catch (err) {
            console.error('Logout failed:', err);
        }
        finally {
            setIsLoggedIn(false);
            setUser(null);
            setAccessToken(null);   
            setLoading(false);
            navigate('/');
        }
    }

    return(
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, handleLogin, handleLogout, loading, user}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    return useContext(AuthContext)
};