import React, { useContext, createContext, useState, useEffect} from 'react'

const AuthContext = createContext();

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('user');
            try {
                if(storedUser){
                    const decryptedUser  = await decryptData(storedUser);
                    setUser(decryptedUser);
                    setIsLoggedIn(true);
                }
                
            } catch (err) {
                console.error("Failed to decrypt user:", err);
                localStorage.removeItem('user');                
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogin = async (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        try {
            const encryptedUser = await encryptData(userData);
            localStorage.setItem('user', encryptedUser);
        } catch (err) {
            console.log("Login failed!!")            
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername(null);
        localStorage.removeItem('user');
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