export interface User 
{
    id: string;
    email: string;
    is_active: boolean;
}

export interface Token 
{
    access_token: string;
    token_type: string;
}

export interface Journal
{
    id: string;
    title: string;
    content?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}
