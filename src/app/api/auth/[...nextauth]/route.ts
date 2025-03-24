import NextAuth, { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

// Declare module augmentations for next-auth
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;

                // GitHub profile contains ID as 'id' but we need to safely access it
                if (profile && "id" in profile) {
                    token.id = profile.id as string;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider
            session.accessToken = token.accessToken;
            if (token.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
