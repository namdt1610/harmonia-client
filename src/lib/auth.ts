import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile',
                },
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.id_token
            }
            return token
        },
        async session({ session, token }) {
            ;(session as any).idToken = token.idToken
            return session
        },
    },
})
