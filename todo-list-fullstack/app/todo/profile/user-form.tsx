"use client";

import { useState, useEffect } from "react";

export default function UserForm({ user }: any) {
    const [form, setForm] = useState({
        name: "",
        family: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name ?? "",
                family: user.family ?? "",
                password: "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) setMessage("✅ Updated successfully!");
        else setMessage(`❌ ${data.error || "Failed to update"}`);

        setLoading(false);
    };

    if (!user) return <p>Loading...</p>;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div>
                <label className="text-sm text-gray-500 dark:text-gray-300 mb-1 block">
                    Email
                </label>
                <input
                    value={user.email}
                    disabled
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-gray-400 w-full"
                />
            </div>

            <div>
                <label className="text-sm text-gray-500 dark:text-gray-300 mb-1 block">
                    Name
                </label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="p-2 border rounded-md dark:bg-gray-800 dark:text-white w-full"
                />
            </div>

            <div>
                <label className="text-sm text-gray-500 dark:text-gray-300 mb-1 block">
                    Family
                </label>
                <input
                    name="family"
                    value={form.family}
                    onChange={handleChange}
                    className="p-2 border rounded-md dark:bg-gray-800 dark:text-white w-full"
                />
            </div>

            <div>
                <label className="text-sm text-gray-500 dark:text-gray-300 mb-1 block">
                    Password
                </label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="p-2 border rounded-md dark:bg-gray-800 dark:text-white w-full"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>

            {message && (
                <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">
                    {message}
                </p>
            )}
        </form>
    );
}
