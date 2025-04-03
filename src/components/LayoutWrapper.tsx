"use client";

import { Github } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const [theme, setTheme] = useState<"light" | "dark">("light");

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
            {/* Navbar Section */}
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
            {children}
        </div>
    );
};

export default LayoutWrapper;
