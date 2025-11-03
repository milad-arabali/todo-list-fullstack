'use client';
import {useActionState} from 'react';
import useSWRMutation from 'swr/mutation';
import {signIn} from 'next-auth/react';
import {useRouter} from "next/navigation";


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

            await router.push("/todo");
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

    if (mutation.isMutating) return <p>Submitting...</p>;

    return (
        <div className="space-y-4">
            <form action={formAction} className="space-y-3">
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        defaultValue={state.values.email}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        defaultValue={state.values.password}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isMutating}
                    className="w-full py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    {mutation.isMutating ? 'Logging in...' : 'Sign In'}
                </button>
            </form>

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
