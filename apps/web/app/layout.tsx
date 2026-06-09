import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PokerProGrid — Construisez votre grille parfaite',
  description:
    'Agrégez, filtrez et trackez vos tournois Winamax en un seul endroit. La précision chirurgicale pour le grind professionnel.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster theme="dark" position="bottom-right" richColors />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
