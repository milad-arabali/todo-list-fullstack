'use client';

import {useActionState, useTransition} from 'react';
import useSWRMutation from 'swr/mutation';
import {signIn} from 'next-auth/react';
import {useRouter} from "next/navigation";

async function signupRequest(
    url: string,
    {arg}: { arg: { name: string; family: string; email: string; password: string } }
) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(arg),
    });

    if (!res.ok) {
        throw new Error('Registration failed!');
    }

    return res.json();
}

export default function SignUpForm() {
    const mutation = useSWRMutation('/api/auth/signup', signupRequest);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function formHandler(
        prevState: any,
        formData: FormData
    ): Promise<{
        success: boolean;
        message: string;
        values: { name: string; family: string; email: string; password: string };
    }> {
        const name = formData.get('name') as string;
        const family = formData.get('family') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !family || !email || !password) {
            return {
                success: false,
                values: prevState.values,
                message: '⚠️ Please fill in all fields!',
            };
        }

        try {
            await mutation.trigger({name, family, email, password});
            startTransition(() => {
                router.push('/todo');
            });
            return {
                success: true,
                values: prevState.values,
                message: '✅ Registration completed successfully!',
            };

        } catch (err) {
            return {
                success: false,
                values: prevState.values,
                message: '❌ An error occurred!',
            };
        }
    }

    const [state, formAction] = useActionState(formHandler, {
        success: false,
        values: {name: '', family: '', email: '', password: ''},
        message: '',
    });

    const handleGoogleSignUp = () => {
        startTransition(() => {
            signIn('google', {callbackUrl: '/todo'}).then();
        });
    };

    return (
        <div className="space-y-4 max-w-sm mx-auto">
            <form action={formAction} className="space-y-3">
                <input
                    type="text"
                    name="name"
                    placeholder="First Name"
                    defaultValue={state.values.name}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="family"
                    placeholder="Last Name"
                    defaultValue={state.values.family}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    defaultValue={state.values.email}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    defaultValue={state.values.password}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />

                <button
                    type="submit"
                    disabled={mutation.isMutating}
                    className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                    {mutation.isMutating ? 'Submitting...' : 'Sign Up'}
                </button>
            </form>

            <div className="flex items-center justify-center my-2">
                <div className="border-t w-1/3"/>
                <span className="mx-2 text-gray-500 text-sm">or</span>
                <div className="border-t w-1/3"/>
            </div>

            <button
                onClick={handleGoogleSignUp}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">
                    {isPending ? 'Connecting...' : 'Sign up with Google'}
                </span>
            </button>

            {state.message && (
                <p
                    className={`text-center text-sm ${
                        state.success ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {state.message}
                </p>
            )}
        </div>
    );
}
