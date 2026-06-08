'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { LayoutGrid, Loader2 } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/register', { email, password, username: username || undefined })

      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Inscription réussie mais connexion échouée. Veuillez vous connecter.')
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-elevated p-8 space-y-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <LayoutGrid className="w-5 h-5 text-electric-blue" />
        <span className="font-bold text-on-surface">PokerProGrid</span>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold text-on-surface">Créer un compte</h1>
        <p className="text-xs text-muted-foreground">Commencez gratuitement</p>
      </div>

      {error && (
        <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-surface-card border border-border rounded px-3 py-2 text-sm text-on-surface focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/30 outline-none transition-colors"
            placeholder="vous@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">
            Pseudo <span className="text-muted-foreground">(optionnel)</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface-card border border-border rounded px-3 py-2 text-sm text-on-surface focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/30 outline-none transition-colors"
            placeholder="MonPseudo"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">Mot de passe *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full bg-surface-card border border-border rounded px-3 py-2 text-sm text-on-surface focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/30 outline-none transition-colors"
            placeholder="8 caractères minimum"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-electric-blue text-white font-semibold py-2.5 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Créer mon compte
        </button>
      </form>

      <div className="text-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
