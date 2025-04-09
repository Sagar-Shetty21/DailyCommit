"use client";

import { RootState, toggleTheme } from "@/utils/store";
import { Github, LogOut, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const theme = useSelector((state: RootState) => state.theme.mode);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const pathname = usePathname();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut({ redirect: true, callbackUrl: "/" });
            // The page will automatically redirect after signOut completes
        } catch (error) {
            console.error("Logout failed:", error);
        }
        setIsModalOpen(false);
    };

    if (pathname === "/login") {
        return <>{children}</>;
    }

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
                        onClick={() => dispatch(toggleTheme())}
                        className={`px-3 py-1 rounded-md`}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    <button
                        onClick={toggleModal}
                        className="focus:outline-none"
                    >
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt="User Avatar"
                                className="h-8 w-8 rounded-full cursor-pointer"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white cursor-pointer">
                                U
                            </div>
                        )}
                    </button>
                </div>
            </nav>
            {children}

            {/* Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-lg">
                    <div
                        ref={modalRef}
                        className={`relative w-72 rounded-lg shadow-lg p-6 ${
                            theme === "dark"
                                ? "bg-gray-800 text-white"
                                : "bg-white text-gray-800"
                        }`}
                    >
                        <button
                            onClick={toggleModal}
                            className={`absolute top-2 right-2 p-1 rounded-full ${
                                theme === "dark"
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center">
                            {/* Centered Profile Image */}
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt="User Avatar"
                                    className="h-24 w-24 rounded-full mb-4"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl mb-4">
                                    {(
                                        session?.user?.name?.[0] || "U"
                                    ).toUpperCase()}
                                </div>
                            )}

                            {/* User Name */}
                            <h3 className="text-xl font-semibold mb-1">
                                {session?.user?.name || "User"}
                            </h3>

                            {/* User Email */}
                            <p
                                className={`text-sm mb-6 ${
                                    theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                }`}
                            >
                                {session?.user?.email || "user@example.com"}
                            </p>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className={`flex items-center justify-center w-full py-2 px-4 rounded-md ${
                                    theme === "dark"
                                        ? "bg-gray-700 hover:bg-gray-600"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LayoutWrapper;
