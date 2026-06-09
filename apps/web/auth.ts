import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

function decodeJwtPayload(token: string): Record<string, string> {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(Buffer.from(payload, 'base64').toString())
  } catch {
    return {}
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken: string
    userId: string
    tier: string
  }
  interface User {
    accessToken: string
    tier: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const apiUrl = process.env.API_URL ?? 'http://localhost:3001/api'
        try {
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })
          if (!res.ok) return null

          const { accessToken } = (await res.json()) as { accessToken: string }
          const payload = decodeJwtPayload(accessToken)

          return {
            id: payload.sub ?? 'unknown',
            email: payload.email ?? (credentials.email as string),
            tier: payload.tier ?? 'FREE',
            accessToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.tier = user.tier
      }
      return token
    },
    session({ session, token }) {
      const t = token as typeof token & { accessToken?: string; tier?: string }
      session.accessToken = t.accessToken ?? ''
      session.userId = t.sub ?? ''
      session.tier = t.tier ?? 'FREE'
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
