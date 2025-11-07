import React from "react";
import {Draggable} from "@hello-pangea/dnd";

type Todo = { _id: string; title: string; status: string };

type Props = {
    status: string;
    todos: Todo[];
    color: string;
    onStatusChange: (id: string, newStatus: string) => void;
};

const statuses = ["Todo", "In progress", "Review", "Done"];

const TodoColumn = ({status, todos, color, onStatusChange}: Props) => {
    const changeStatus = async (id: string, direction: "next" | "back") => {
        const currentIndex = statuses.indexOf(status);
        const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0 || newIndex >= statuses.length) return;
        const newStatus = statuses[newIndex];

        await fetch("/api/todo", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id, status: newStatus}),
        });

        onStatusChange(id, newStatus);
    };

    return (
        <div
            className="rounded-xl shadow-md flex flex-col overflow-hidden w-full max-w-[280px] sm:max-w-[320px] bg-white dark:bg-gray-900">
            <div className={`${color} bg-opacity-80 p-3`}>
                <h3 className="text-base font-semibold text-white text-center tracking-wide">
                    {status}
                </h3>
            </div>

            <div className="flex flex-col gap-3 p-3 bg-white dark:bg-gray-800 h-full overflow-y-auto">
                {todos.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                        No tasks available
                    </p>
                ) : (
                    todos.map((todo, idx) => (
                        <Draggable key={todo._id} draggableId={todo._id} index={idx}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex flex-col justify-between p-3 rounded-lg shadow-sm hover:shadow-md
                     transform hover:-translate-y-[2px] transition-all duration-300 bg-gray-50 dark:bg-gray-700"
                                >
                                    <div className="border-t-4 border-indigo-500 text-gray-800 dark:text-gray-100
                        font-medium text-sm px-2 py-1 mb-2 text-center truncate">
                                        {todo.title}
                                    </div>

                                    <div className="flex justify-between mt-1 gap-2">
                                        <button
                                            disabled={status === "Todo"}
                                            onClick={() => changeStatus(todo._id, "back")}
                                            className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-md
                        hover:bg-red-600 transition shadow-sm hover:shadow-md disabled:opacity-40"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            disabled={status === "Done"}
                                            onClick={() => changeStatus(todo._id, "next")}
                                            className="px-2.5 py-1 text-xs bg-green-500 text-white rounded-md
                        hover:bg-green-600 transition shadow-sm hover:shadow-md disabled:opacity-40"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    ))
                )}
            </div>
        </div>
    );
};

export default TodoColumn;
