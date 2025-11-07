import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UserForm from "@/app/todo/profile/user-form";
import {headers} from "next/headers";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    const requestHeaders = await headers();
    const cookie = requestHeaders.get("cookie");

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
        cache: "no-store",
        headers: {
            Cookie: cookie || "",
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch profile:", res.status);
    }

    const data = await res.json();

    return (
        <div className="flex min-h-32 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main
                className="flex flex-col items-center justify-center gap-6 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg w-[400px]">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Profile Settings
                </h1>
                <UserForm user={data.user}/>
            </main>
        </div>
    );
}
