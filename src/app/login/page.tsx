"use client";

import { BookmarkIcon, Calendar, Github, RocketIcon } from "lucide-react";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
    const { data: session } = useSession();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Left side - Product info */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
                <div className="max-w-md">
                    <h1 className="text-4xl font-bold mb-2 flex items-center">
                        <span className="mr-2">Daily</span>
                        <span className="text-emerald-400">Commit</span>
                    </h1>
                    <p className="text-gray-300 mb-8">
                        Build your writing habit, one commit at a time.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="bg-emerald-500 p-3 rounded-lg mr-4">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">
                                    Daily Consistency
                                </h3>
                                <p className="text-gray-400">
                                    Commit your thoughts, notes, or diary
                                    entries daily to build a consistent writing
                                    habit.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-emerald-500 p-3 rounded-lg mr-4">
                                <BookmarkIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">
                                    Version Control
                                </h3>
                                <p className="text-gray-400">
                                    Leverage GitHub's powerful version control
                                    to track changes and never lose your
                                    content.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-emerald-500 p-3 rounded-lg mr-4">
                                <RocketIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">
                                    Growth Tracking
                                </h3>
                                <p className="text-gray-400">
                                    Watch your contribution graph fill up as you
                                    build your writing portfolio over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Welcome to DailyCommit
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Log in to start your daily writing journey
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 text-center">
                            Connect with your GitHub account to get started.
                            We'll help you create a repository for your daily
                            commits.
                        </p>

                        <button
                            onClick={() => signIn("github")}
                            className="w-full bg-gray-900 cursor-pointer hover:bg-gray-800 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            Continue with GitHub
                        </button>

                        <div className="text-center text-xs text-gray-500 mt-6">
                            <p>By continuing, you agree to DailyCommit's</p>
                            <p>Terms of Service and Privacy Policy</p>
                        </div>
                    </div>

                    {/* Mobile view feature highlights */}
                    <div className="mt-8 lg:hidden">
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-gray-700 font-medium mb-4 text-center">
                                Why DailyCommit?
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-emerald-500 mr-3" />
                                    <span className="text-sm text-gray-700">
                                        Daily writing habit building
                                    </span>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <BookmarkIcon className="w-5 h-5 text-emerald-500 mr-3" />
                                    <span className="text-sm text-gray-700">
                                        Version-controlled content
                                    </span>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <RocketIcon className="w-5 h-5 text-emerald-500 mr-3" />
                                    <span className="text-sm text-gray-700">
                                        Visual progress tracking
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
