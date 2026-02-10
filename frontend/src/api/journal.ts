import apiClient from "./client";
import type { Journal } from "../types";

export const journalServices = {
    async getJournals(): Promise<Journal[]> {
        const response = await apiClient.get<Journal[]>("/journal/");
        return response.data;
    },

    async createJournal(data: { title: string; content?: string }): Promise<Journal> {
        const response = await apiClient.post<Journal>("/journal/", data);
        return response.data;
    },

    async updateJournal(id: string,data: Partial<Journal>): Promise<Journal> {
        const response = await apiClient.patch<Journal>(`/journal/${id}`, data);
        return response.data;
    },

    async deleteJournal(id: string): Promise<void> {
        await apiClient.delete(`/journal/${id}`);
    },
};
