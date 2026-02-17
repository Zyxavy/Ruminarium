/**
 * Journal service – API operations for creating, reading, updating, and deleting journal entries.
 *
 * All methods use the centralized `apiClient`, which automatically:
 * - Adds the Bearer token from localStorage (if present)
 * - Handles 401 responses by clearing token and redirecting to /login
 *
 * All endpoints are protected — a valid authentication token is required.
 */
import apiClient from "./client";
import type { Journal } from "../types";

export const journalServices = {
    /**
   * Fetch all journal entries belonging to the authenticated user
   * Endpoint: GET /api/v1/journal/
   */
    async getJournals(): Promise<Journal[]> {
        const response = await apiClient.get<Journal[]>("/journal/");
        return response.data;
    },

    /**
   * Create a new journal entry
   * Endpoint: POST /api/v1/journal/
   */
    async createJournal(data: { title: string; content?: string }): Promise<Journal> {
        const response = await apiClient.post<Journal>("/journal/", data);
        return response.data;
    },

    /**
   * Update an existing journal entry (partial updates supported)
   * Endpoint: PATCH /api/v1/journal/{id}
   */
    async updateJournal(id: string,data: Partial<Journal>): Promise<Journal> {
        const response = await apiClient.patch<Journal>(`/journal/${id}`, data);
        return response.data;
    },

    /**
   * Delete a journal entry
   * Endpoint: DELETE /api/v1/journal/{id}
   */
    async deleteJournal(id: string): Promise<void> {
        await apiClient.delete(`/journal/${id}`);
    },
};
