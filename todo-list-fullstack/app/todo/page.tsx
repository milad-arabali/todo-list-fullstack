import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import TodoList from "./todo-list";
import {headers} from "next/headers";

export default async function TodoPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const cookie = (await headers()).get("cookie");

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
        cache: "no-store",
        headers: {
            Cookie: cookie || "",
        }
    })
    if (!res.ok) {
        console.error("Failed to fetch profile:", res.status);
    }
    const data = await res.json();


    return (
        <div className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 dark:bg-black font-sans p-4">
            <main className="flex flex-col items-center justify-center gap-6 w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">
                    Welcome, {data?.user?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Your protected Todo page content goes here.
                </p>
                <TodoList/>
            </main>
        </div>
    );
}
