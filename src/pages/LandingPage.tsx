import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) {
      console.error('Login error:', error.message)
      setLoading(false)
    }
    // Supabase handles redirect automatically
  }

  return (
    <div className="min-h-screen bg-landing-gradient flex flex-col">
      {/* Header */}
      <header className="container flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <span className="text-xl lg:text-2xl font-bold tracking-tight">Therapy Pathways</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogin}
          disabled={loading}
          className="px-4 py-2 text-sm lg:text-base"
        >
          {loading ? 'Loading...' : 'Log in with Google'}
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 text-center space-y-8">
        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-muted/50">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
          Healing isn't linear.
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
          A safe space to log your emotions, track progress, and organize your thoughts in between sessions. 
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
          Empowering continued growth throughout your therapy journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" className="h-12 px-8 text-base" onClick={handleLogin}>
            Get started
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base">
            Learn more
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="container py-20 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Shield, title: 'Private & Secure', desc: 'Your data is encrypted and secure. Your reflections are for your eyes only.' },
          { icon: Heart, title: 'Mood Tracking', desc: 'Check in with yourself daily to see patterns in your emotional well-being.' },
          { icon: Sparkles, title: 'Guided Reflection', desc: 'Structure your post-session thoughts with guided prompts for deeper insights.' },
          { icon: TrendingUp, title: 'Goal Progress', desc: 'Visualize your growth with goal tracking and celebrate your achievements.' },
        ].map((feature, index) => (
          <div key={index} className="glass p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="container py-12 px-6 lg:px-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.</p>
      </footer>
    </div>
  )
}
