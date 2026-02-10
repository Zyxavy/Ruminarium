import React, { useEffect, useState } from "react"
import { journalServices  } from "../api/journal"
import type { Journal } from "../types"

const JournalList: React.FC = () => {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJournals = async () => {
            try 
            {
                const data = await journalServices.getJournals();
                setJournals(data);
            } 
            catch (error) 
            {
                console.error("Failed to fetch journals", error);
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchJournals();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Journals</h1>

            {journals.length === 0 ? (
                <p className="text-gray-500">
                    The page is blank. Time to write? 
                </p>
            ) : (
                <div className="grid gap-4">
                    {journals.map((j) => (
                        <div
                            key={j.id}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <h2 className="text-xl font-semibold">
                                {j.title}
                            </h2>
                            <p className="text-gray-600 line-clamp-2">
                                {j.content}
                            </p>
                            <span className="text-xs text-gray-400">
                                {new Date(j.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JournalList;