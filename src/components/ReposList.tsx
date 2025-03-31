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

    const handleLogin = () => {
        // In a real app, you would implement GitHub OAuth flow
        // This is a simplified version for demonstration
        const userToken = prompt("Enter your GitHub personal access token:");
        if (userToken) {
            // localStorage.setItem("github_token", userToken);
            setToken(userToken);
            setLoading(true);
        }
    };

    const handleLogout = () => {
        // localStorage.removeItem("github_token");
        setToken(null);
        setRepositories([]);
    };

    // if (!token) {
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
    //             <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
    //                 <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
    //                     Daily Notes
    //                 </h1>
    //                 <p className="text-gray-600 mb-8 text-center">
    //                     Create and maintain daily journal entries directly in
    //                     GitHub repositories. Login with your GitHub account to
    //                     get started.
    //                 </p>
    //                 <Link
    //                     // onClick={handleLogin}
    //                     href="/login"
    //                     className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
    //                 >
    //                     <svg
    //                         className="w-5 h-5"
    //                         viewBox="0 0 24 24"
    //                         fill="currentColor"
    //                     >
    //                         <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    //                     </svg>
    //                     Login with GitHub
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
            {/* Header */}
            <header className="p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Daily Notes
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                    Logout
                </button>
            </header>

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
