import apiClient from "./client";

export const aiService = {
    getSuggestion: async (mood: string) => {
        const response = await apiClient.post(
            "/ai/suggest",
            null,
            { params: { mood } }
        );
        return response.data;
    }
};

