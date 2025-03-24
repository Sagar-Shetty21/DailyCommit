"use client";

import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { Github } from "lucide-react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const EditorJSComponent = dynamic(
    () => {
        return import("./EditorJSComponent");
    },
    { ssr: false }
);

const HomePage: React.FC = () => {
    const { data: session } = useSession();
    const editorRef = useRef<EditorJS | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const handleSaveToGitHub = async () => {
        if (editorRef.current) {
            try {
                setIsSaving(true);
                const data = await editorRef.current.save();

                // Simulate API call to save to GitHub
                await new Promise((resolve) => setTimeout(resolve, 1500));

                console.log("Saved data to GitHub:", data);
                setIsSaving(false);
            } catch (error) {
                console.error("Failed to save to GitHub", error);
                setIsSaving(false);
            }
        }
    };

    const handleEditorReady = (editor: EditorJS) => {
        editorRef.current = editor;
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${
                theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-900"
            }`}
        >
            {/* Navbar */}
            <nav
                className={`px-6 py-4 flex items-center justify-between ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-md`}
            >
                <div className="flex items-center space-x-2">
                    <Github
                        className={`h-6 w-6 ${
                            theme === "dark"
                                ? "text-indigo-400"
                                : "text-indigo-600"
                        }`}
                    />
                    <span className="font-bold text-xl">DailyCommit</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className={`px-3 py-1 rounded-md`}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt="User Avatar"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            U
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h1
                            className={`text-2xl font-bold ${
                                theme === "dark"
                                    ? "text-gray-100"
                                    : "text-gray-800"
                            }`}
                        >
                            Today&apos;s Entry
                        </h1>
                        <div className="text-sm">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <p
                        className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                        } mt-1`}
                    >
                        Write your thoughts, they&apos;ll be safely stored in
                        your private GitHub repository.
                    </p>
                </div>

                {/* Editor Container */}
                <div
                    className={`p-5 rounded-lg shadow-lg mb-4 min-h-[400px] ${
                        theme === "dark"
                            ? "bg-gray-800 border border-gray-700"
                            : "bg-white border border-gray-200"
                    }`}
                >
                    <EditorJSComponent onReady={handleEditorReady} />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSaveToGitHub}
                        disabled={isSaving}
                        className={`
                            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                            ${
                                theme === "dark"
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                            }
                            transition-colors duration-200
                            disabled:opacity-70 disabled:cursor-not-allowed
                        `}
                    >
                        <Github className="h-5 w-5" />
                        <span>
                            {isSaving ? "Committing..." : "Commit to GitHub"}
                        </span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
