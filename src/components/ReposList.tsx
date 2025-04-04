"use client";

import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Plus, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useGithubToken } from "@/utils/helpers";

interface Repository {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    updated_at: string;
    stargazers_count: number;
}

const ReposList: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(useGithubToken());

    useEffect(() => {
        const fetchRepositories = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const octokit = new Octokit({ auth: token });
                const response = await octokit.repos.listForAuthenticatedUser({
                    sort: "updated",
                    per_page: 100,
                });

                // Filter repos created by this app (you might want to add some metadata or naming convention)
                const appRepos = response.data;
                // setRepositories(appRepos);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching repositories:", err);
                setError(
                    "Failed to fetch repositories. Please check your GitHub token."
                );
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [token]);

    const handleCreateRepo = async () => {
        if (!token) {
            setError("Please login with GitHub first");
            return;
        }

        const repoName = prompt("Enter a name for your new repository:");
        if (!repoName) return;

        try {
            setLoading(true);
            const octokit = new Octokit({ auth: token });
            const response = await octokit.repos.createForAuthenticatedUser({
                name: repoName,
                description: "Created with Daily Notes App",
                private: true,
                auto_init: true,
            });

            // Add the newly created repo to the list
            setRepositories([response.data, ...repositories]);
            setLoading(false);
        } catch (err) {
            console.error("Error creating repository:", err);
            setError("Failed to create repository. Please try again.");
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
            {/* Main content */}
            <main className="flex-1 container mx-auto px-6 pb-20">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start">
                        <AlertCircle
                            className="text-red-500 mr-3 flex-shrink-0"
                            size={20}
                        />
                        <p className="text-red-700">{error}</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Your Repositories
                        </h2>

                        {repositories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {repositories.map((repo) => (
                                    <div
                                        key={repo.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                    {repo.name}
                                                </h3>
                                                <div className="flex items-center text-gray-500">
                                                    <svg
                                                        className="h-4 w-4 mr-1"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                    <span>
                                                        {repo.stargazers_count}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                                                {repo.description ||
                                                    "No description provided"}
                                            </p>

                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Updated{" "}
                                                    {formatDate(
                                                        repo.updated_at
                                                    )}
                                                </span>
                                                <a
                                                    href={`/editor/${repo.name}`}
                                                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                                                >
                                                    <BookOpen
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    Open
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <BookOpen
                                            size={32}
                                            className="text-indigo-600"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No repositories yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Create your first repository to get started
                                    with your daily notes journey.
                                </p>
                                <button
                                    onClick={handleCreateRepo}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Create Repository
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Floating action button */}
            {repositories.length > 0 && (
                <div className="fixed bottom-8 right-8">
                    <button
                        onClick={handleCreateRepo}
                        className="h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Create new repository"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReposList;
