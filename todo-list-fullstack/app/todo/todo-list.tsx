"use client";

import React, { useEffect, useState } from "react";
import TodoColumn from "./todo-column";

type Todo = { title: string; status: string };
const statuses = ["Todo", "In progress", "Review", "Done"];
const statusColors: Record<string, string> = {
    "Todo": "bg-blue-500",
    "In progress": "bg-green-500",
    "Review": "bg-yellow-500",
    "Done": "bg-purple-500",
};

const TodoList = () => {
    const [todos, setTodos] = useState<Record<string, Todo[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/todo");
                if (!res.ok) throw new Error("Failed to fetch todos");
                const data = await res.json();
                if (data.success) {
                    setTodos(data.todos);
                } else {
                    setError(data.error || "Unknown error");
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchTodos().then();
    }, []);

    if (loading) return <p className="text-center p-4">در حال دریافت داده‌ها...</p>;
    if (error) return <p className="text-red-500 text-center p-4">خطا: {error}</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl p-4">
            {statuses.map((status) => (
                <TodoColumn
                    key={status}
                    status={status}
                    todos={todos[status] || []}
                    color={statusColors[status]}
                />
            ))}
        </div>
    );
};

export default TodoList;
