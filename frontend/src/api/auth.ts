import apiClient from "./client";
import type { Token, User } from "../types";

export const authService = {
    async login(formData: FormData): Promise<Token> {
        const response = await apiClient.post<Token>('/auth/login', formData);
        if(response.data.access_token)
        {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    async getMe(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    }
};