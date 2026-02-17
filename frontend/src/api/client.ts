/**
 * API Client Configuration
 * 
 * This module configures and exports an Axios instance for making HTTP requests
 * to the backend API. It includes:
 * - Base URL configuration from environment variables
 * - Automatic authentication token injection
 * - Response interceptor for handling common errors (e.g., 401 Unauthorized)
 * 
 */

import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * Configured Axios instance for API communication
 * 
 * Base URL is loaded from environment variable VITE_API_URL, with fallback
 * to localhost for development. All requests default to JSON content type.
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request Interceptor
 * 
 * Automatically attaches JWT authentication token to every outgoing request
 * if a token exists in localStorage. The token is added as a Bearer token
 * in the Authorization header.
 * 
*/
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Response Interceptor
 * 
 * Handles global response processing and error handling:
 * - Passes through successful responses unchanged
 * - Catches 401 (Unauthorized) errors, clears invalid tokens, and redirects to login
 * - Forwards all other errors to the calling code for handling
*/
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
