import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"

import { login } from "@/lib/api";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await login(credentials.email, credentials.password);

                const data = await res.json()

                if (res.ok && data.token) {
                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        username: data.user.username, // <-- incluir isso!
                        accessToken: data.token,
                    }
                }

                return null
            }
        })
    ], callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            // Caso o login seja com email/senha (CredentialsProvider)
            if (user?.accessToken) {
                token.accessToken = user.accessToken
                token.userId = user.id
                token.name = user.name
                token.email = user.email
                token.username = user.username
            }

            // Caso o login seja com Google
            if (account?.provider === "google" && profile?.email) {
                try {
                    const res = await fetch("http://127.0.0.1:8000/api/google-login/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: profile.email,
                            name: profile.name,
                        }),
                    });

                    const data = await res.json();

                    if (data?.token) {
                        token.accessToken = data.token;
                        token.userId = data.user.id;
                        token.name = data.user.name;
                        token.email = data.user.email;
                        token.username = data.user.username; // <-- aqui
                    }
                } catch (error) {
                    console.error("Erro ao fazer login com Google:", error);
                }
            }

            return token;
        },
        async session({ session, user, token }) {
            session.user.id = token.userId;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.username = token.username; // <-- aqui
            session.accessToken = token.accessToken;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };