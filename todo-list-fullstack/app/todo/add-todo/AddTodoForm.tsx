"use client";

import React, {useActionState, useState, useTransition} from "react";
import {FiPlusCircle} from "react-icons/fi";
import useSWRMutation from "swr/mutation";

type Template = { name: string; color: string };

const templates: Template[] = [
    {name: "Todo", color: "bg-blue-500"},
    {name: "In progress", color: "bg-green-500"},
    {name: "Review", color: "bg-yellow-500"},
    {name: "Done", color: "bg-purple-500"},
];

type Todo = { title: string; status: string };

async function addTodoRequest(url: string, {arg}: { arg: Todo }) {
    const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(arg),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
    }
    return res.json();
}

export default function AddTodoForm() {
    const mutation = useSWRMutation("/api/todo", addTodoRequest);
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [state, formAction] = useActionState<{ success: boolean; values: Todo; message: string }, FormData>(
        async (prevState, formData) => {
            const title = formData.get("title") as string;
            const status = formData.get("status") as string;

            if (!title || !status) {
                return {success: false, values: prevState.values, message: "⚠️ Please fill all fields"};
            }

            try {
                await mutation.trigger({title, status});
                return {success: true, values: {title: "", status: ""}, message: "✅ Todo added successfully!"};
            } catch (err: any) {
                return {success: false, values: prevState.values, message: err.message};
            }
        },
        {success: false, values: {title: "", status: ""}, message: ""}
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("status", selectedStatus);

        startTransition(() => {
            formAction(formData);
            setTitle("");
            setSelectedStatus("");
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md bg-white
        dark:bg-gray-800 shadow-lg rounded-xl p-6">
            <header className="flex items-center gap-2 mb-2">
                <FiPlusCircle size={28} className="text-indigo-500"/>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">New Todo</h2>
            </header>

            <input
                name="title"
                type="text"
                placeholder="Enter Todo title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50
                dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <section aria-label="Select template" className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                    <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedStatus(t.name)}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition ${selectedStatus === t.name ?
                            "ring-2 ring-offset-2 ring-indigo-500" : ""} ${t.color}`}
                    >
                        {t.name}
                    </button>
                ))}
            </section>

            <button type="submit" disabled={mutation.isMutating || isPending} className="w-full bg-indigo-500
            hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50">
                {mutation.isMutating || isPending ? "Adding..." : "Add Todo"}
            </button>

            {state.message && (
                <p className={`text-center text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}
