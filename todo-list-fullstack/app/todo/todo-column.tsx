import React from "react";

type Todo = { title: string; status: string };

type Props = {
    status: string;
    todos: Todo[];
    color: string;
};

const TodoColumn = ({status, todos, color}: Props) => {
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
                        <div
                            key={idx}
                            className="flex flex-col justify-between p-3 rounded-lg shadow-sm hover:shadow-md
                     transform hover:-translate-y-[2px] transition-all duration-300 bg-gray-50 dark:bg-gray-700"
                        >
                            <div className="border-t-4 border-indigo-500 text-gray-800 dark:text-gray-100
                          font-medium text-sm px-2 py-1 mb-2 text-center truncate">
                                {todo.title}
                            </div>

                            <div className="flex justify-between mt-1 gap-2">
                                <button
                                    className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-md
                         hover:bg-red-600 transition shadow-sm hover:shadow-md"
                                >
                                    ← Back
                                </button>
                                <button
                                    className="px-2.5 py-1 text-xs bg-green-500 text-white rounded-md
                         hover:bg-green-600 transition shadow-sm hover:shadow-md"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
};

export default TodoColumn;
