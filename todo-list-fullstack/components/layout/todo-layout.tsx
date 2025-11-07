"use client";
import React, {useState} from "react";
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import Link from "next/link";

export default function TodoLayout({children}: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div
            className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
            <header className="h-20 bg-blue-600 text-white flex items-center justify-between p-4 shadow-md">
                <h1 className="text-lg font-semibold">My TodoList</h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden p-2 rounded hover:bg-blue-700 transition"
                >
                    {isSidebarOpen ? <HiOutlineX size={24}/> : <HiOutlineMenu size={24}/>}
                </button>
            </header>
            <div className="flex flex-1">
                <aside
                    className={`fixed md:static top-0 left-0 z-40 
                    min-h-screen md:min-h-screen  
                    w-64 md:w-64 
                    bg-gray-800 text-gray-100 p-4
                     transform md:transform-none transition-transform duration-300 ease-in-out
                     ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                >
                    <div className="absolute -top-6 left-0 w-full h-6 bg-gray-800 rounded-tr-lg shadow-lg hidden sm:block"></div>
                    <nav className="space-y-2 relative z-10">
                        <Link href="/todo" className="block px-3 py-2 rounded hover:bg-gray-700">
                            🏠 Dashboard
                        </Link>
                        <Link href="/todo/add-todo" className="block px-3 py-2 rounded hover:bg-gray-700">
                            ✅ AddTodos
                        </Link>
                        <a href="/todo/profile" className="block px-3 py-2 rounded hover:bg-gray-700">
                            ⚙️ Profile
                        </a>
                    </nav>
                </aside>

                <main className="flex-1 container mx-auto p-6 md:ml-0">
                    {children}
                </main>
            </div>

            <footer className="bg-[#0077b6] text-gray-200 text-center py-4">
                TodoList © {new Date().getFullYear()}
            </footer>
        </div>
    );
}
