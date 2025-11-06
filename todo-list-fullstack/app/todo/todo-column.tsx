import React from "react";

type Todo = { title: string; status: string };

type Props = {
    status: string;
    todos: Todo[];
    color: string;
};

const TodoColumn = ({status, todos, color}: Props) => {
    return (
        <div className="rounded-xl shadow-lg flex flex-col overflow-hidden w-full max-w-sm">
            <div className={`${color} bg-opacity-70 p-4`}>
                <h3 className="text-lg font-bold text-white text-center">{status}</h3>
            </div>

            <div className="flex flex-col gap-3 p-4  bg-white dark:bg-gray-800 h-full overflow-y-auto">
                {todos.map((todo, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col justify-between p-4 rounded-xl shadow-lg hover:shadow-2xl
                        transform hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-800"
                    >

                        <div className="border-t-4 border-indigo-500 text-gray-800
                        dark:text-gray-100 font-semibold px-2 py-1 mb-3 flex items-center justify-center">
                            {todo.title}
                        </div>

                        <div className="flex justify-between mt-2 gap-2">
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-red-500
                                text-white rounded-lg hover:bg-red-600 transition shadow hover:shadow-lg">
                                ← Back
                            </button>
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-green-500
                                 text-white rounded-lg hover:bg-green-600 transition shadow hover:shadow-lg">
                                Next →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoColumn;
