import React, { useContext, createContext, useState} from 'react'

const AuthContext = createContext();

const excryptData = (data) => {
    const key = import.meta.env.VITE_SECRET_KEY;
    const encodedData = new TextEncoder().encode(data);

    return window.crypto.subtle.digest('SHA-256', new TextEncoder.encode(key))
    .then(hash => window.crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt']))
    .then(cryptoKey => window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, cryptoKey, encodedData))
    .then(encryptedData => btoa(String.fromCharCode(...new Uint8Array(encryptedData))));
    
};

const decryptData = (ciphertext) => {
    const key = import.meta.env.VITE_SECRET_KEY;
    const encryptedData = new Uint8Array(atob(ciphertext).split('').map(char => char.charCodeAt(0)));

    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
    .then(hash => window.crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['decrypt']))
    .then(cryptoKey => window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, cryptoKey, encryptedData))
    .then(decryptedData => new TextDecoder().decode(decryptedData));

};

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return(
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    return useContext(AuthContext)
};