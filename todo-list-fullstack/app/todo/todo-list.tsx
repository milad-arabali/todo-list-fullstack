"use client";

import React, {useEffect, useState} from "react";
import TodoColumn from "./todo-column";
import {DragDropContext, Droppable, DropResult} from "@hello-pangea/dnd";

type Todo = { _id: string; title: string; status: string };
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

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/todo");
            const data = await res.json();
            if (data.success) setTodos(data.todos);
            setLoading(false);
        })();
    }, []);

    const updateTodoStatus = (id: string, newStatus: string) => {
        setTodos(prev => {
            const updated: Record<string, Todo[]> = {};
            for (const [status, list] of Object.entries(prev)) {
                updated[status] = list.filter(todo => todo._id !== id);
            }
            const movedTodo = Object.values(prev).flat().find(t => t._id === id);
            if (movedTodo) {
                updated[newStatus] = [...(updated[newStatus] || []), {...movedTodo, status: newStatus}];
            }
            return updated;
        });
    };

    const onDragEnd = async (result: DropResult) => {
        const {destination, source, draggableId} = result;
        if (!destination || destination.droppableId === source.droppableId) return;
        const newStatus = destination.droppableId;
        await fetch("/api/todo", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: draggableId, status: newStatus}),
        });

        updateTodoStatus(draggableId, newStatus);
    };

    if (loading) return <p className="text-center p-4">Loading...</p>;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto p-6">
                {statuses.map((status) => (
                    <Droppable droppableId={status} key={status}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <TodoColumn
                                    status={status}
                                    todos={todos[status] || []}
                                    color={statusColors[status]}
                                    onStatusChange={updateTodoStatus}
                                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TodoList;
