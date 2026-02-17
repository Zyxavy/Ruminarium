/**
 * Authentication service – high-level API for login, registration, and current user info.
 *
 * - Login: sends credentials using form-urlencoded format (matches backend expectation)
 * - Register: creates new user account
 * - Get current user: fetches authenticated user's profile
 *
 * All methods use the centralized `apiClient` which handles:
 * - Base URL
 * - Automatic Bearer token attachment
 * - 401 redirect to login
 */
import apiClient from "./client";
import type { Token, User } from "../types";

//Authenticates user and stores access token in localStorage
export const authService = {
    async login(email: string, password: string): Promise<Token> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post<Token>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    /**
   * Fetches information about the currently authenticated user
   *
   * Requires valid JWT token (automatically attached by apiClient interceptor)
   */
    async getMe(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    //Registers a new account
    async register(email: string, password: string): Promise<User> {
        const response = await apiClient.post<User>('/auth/register', { email: email.trim(), password });
        return response.data;
    },
};
