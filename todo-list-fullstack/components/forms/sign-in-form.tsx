'use client';

import {useActionState, useTransition} from 'react';
import useSWRMutation from 'swr/mutation';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';

async function loginRequest(
    url: string,
    {arg}: { arg: { email: string; password: string } }
) {
    const res = await signIn('credentials', {
        redirect: false,
        email: arg.email,
        password: arg.password,
    });
    return res;
}

export default function SignInForm() {
    const mutation = useSWRMutation('/api/auth/signin', loginRequest);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function formHandler(
        prevState: any,
        formData: FormData
    ): Promise<{
        success: boolean;
        message: string;
        values: { email: string; password: string };
    }> {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return {
                success: false,
                values: prevState.values,
                message: '⚠️ Please fill in all fields!',
            };
        }

        try {
            const res = await mutation.trigger({email, password});

            if (res?.error) {
                return {
                    success: false,
                    values: {email, password},
                    message: '❌ Incorrect email or password!',
                };
            }


            startTransition(() => {
                router.push('/todo');
            });

            return {
                success: true,
                values: {email: '', password: ''},
                message: '✅ Login successful!',
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
        values: {email: '', password: ''},
        message: '',
    });

    const handleGoogleSignIn = () => {
        startTransition(() => {
            signIn('google', {callbackUrl: '/todo'}).then();
        });
    };

    return (
        <div className="space-y-4 max-w-sm mx-auto">
            <form action={formAction} className="space-y-3">
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
                    className="w-full py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    {mutation.isMutating ? 'Logging in...' : 'Sign In'}
                </button>
            </form>

            <div className="flex items-center justify-center my-2">
                <div className="border-t w-1/3"/>
                <span className="mx-2 text-gray-500 text-sm">or</span>
                <div className="border-t w-1/3"/>
            </div>

            <button
                onClick={handleGoogleSignIn}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">
          {isPending ? 'Connecting...' : 'Sign in with Google'}
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
