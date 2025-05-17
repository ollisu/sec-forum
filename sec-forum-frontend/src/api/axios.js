import axios  from "axios";

const instance = axios.create({
  baseURL: '/api', //import.meta.env.VITE_BASE_URL || "http://localhost:4000/",
  withCredentials: true,
});

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
  };


// Set the access token in the axios instance headers for all requests
// This will be used to authenticate the user for all requests that require authentication
instance.interceptors.request.use(
    async (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }  
        return config; 
    },
    (error) => {
        return Promise.reject(error);
    }
)
// Add a response interceptor to handle 401 errors and refresh the access token
// This will be used to refresh the access token when it expires.
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;
            try {
                const res = await instance.post('/auth/refresh_token');
                const { accessToken: newAccessToken } = res.data;
                setAccessToken(newAccessToken);
                // Update the original request with the new access token.
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(error.config); // Retry the original request with the new access token.
            } catch (err) {
                console.error('Error refreshing token:', err);
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }

);

export default instance;