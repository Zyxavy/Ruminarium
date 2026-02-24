/**
 * Shared TypeScript interfaces for the Journal application frontend.
 *
 * These types represent:
 * - Authentication-related data (User, Token)
 * - Core domain entity (Journal)
 *
 * They are used across:
 * - API services (authService, journalServices)
 * - State management (stores, context, reactive state)
 * - Components (props, form values, displayed data)
 *
 * - All dates are ISO 8601 strings (e.g. "2025-02-17T12:45:00Z")
 * - IDs are UUID strings
 * - Optional fields use `?'
 */

//Represents a registered/authenticated user.
export interface User 
{
    id: string;
    email: string;
    is_active: boolean;
}

//Response shape from successful login endpoint.
export interface Token 
{
    access_token: string;
    token_type: string;
}

//Represents a single journal entry.
export interface Journal
{
    id: string;
    title: string;
    content?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

//Represents a search result from journal entries.
export type JournalSearchResult = {
  id: string;
  title: string;
  snippet: string | null;
  created_at: string;
  rank: number | null;
}