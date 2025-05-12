"use client";

import React, { useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { Github, Layout } from "lucide-react";
import dynamic from "next/dynamic";
import LayoutWrapper from "./LayoutWrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";

const EditorJSComponent = dynamic(
    () => {
        return import("./EditorJSComponent");
    },
    { ssr: false }
);

const HomePage: React.FC = () => {
    const editorRef = useRef<EditorJS | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const theme = useSelector((state: RootState) => state.theme.mode);

    const handleSaveToGitHub = async () => {
        if (editorRef.current) {
            try {
                setIsSaving(true);
                const data = await editorRef.current.save();

                // Simulate API call to save to Github
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

    return (
        <LayoutWrapper>
            {/* Main Content Section */}
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
        </LayoutWrapper>
    );
};

export default HomePage;
