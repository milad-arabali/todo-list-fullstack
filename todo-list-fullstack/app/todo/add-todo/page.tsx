import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import AddTodoForm from "@/app/todo/add-todo/AddTodoForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Add Todo | Todo App",
    description: "Create a new todo in your Todo App",
    openGraph: {
        title: "Add Todo | Todo App",
        description: "Create a new todo in your Todo App",
        url: "http://localhost:3000/todo/add-todo",
        type: "website",
    },
};
export default async function AddTodo() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    return (
        <main className="flex justify-center bg-zinc-50 font-sans dark:bg-black">
            <section className="flex flex-col items-center justify-center gap-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add New Todo</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Create your todo with a title and template
                </p>
                <AddTodoForm/>
            </section>
        </main>
    );
}
