import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "@/utils/connectDb";
import User from "@/models/users";
import {comparePassword} from "@/utils/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "example@email.com"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required!");
                }

                await connectDb();
                const user = await User.findOne({email: credentials.email});
                if (!user) {
                    throw new Error("No user found with this email!");
                }
                const isValid = await comparePassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Incorrect password!");
                }
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/signin",
    },
    // callbacks: {
    //     async redirect({url, baseUrl}) {
    //         return "/todo";
    //     }
    // },

    secret: process.env.SECRET_KEY,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
