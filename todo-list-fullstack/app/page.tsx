import SignInForm from "@/components/forms/sign-in-form";
import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/todo");
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-1">
                    Sign In
                </h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Please enter your email and password
                </p>

                <SignInForm/>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{' '}
                    <Link href="/signup" className="text-indigo-600 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>

    );
}
