import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) console.error('Login error:', error.message)
  }

  return (
    <div className="min-h-screen landing-gradient flex flex-col">
      <header className="container flex h-20 items-center justify-between">
        <span className="text-xl font-bold tracking-tight">Therapy Pathways</span>
        <Button variant="ghost" onClick={handleLogin}>Log in with Google</Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        <div className="glass p-8 rounded-2xl max-w-xl space-y-4 shadow-lg">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-accent/50 text-accent-foreground">
            Your therapy companion for in-between sessions
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Track, reflect, and grow with guided support
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Organize your thoughts, log reflections, and stay connected to your healing journey — all in one trusted tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base" onClick={handleLogin}>
              Start your journey
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Learn more
            </Button>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl mt-12">
          {[
            { icon: Shield, title: "Private & Secure", desc: "Your reflections are protected, stored securely, and accessible only by you." },
            { icon: Heart, title: "Mood Tracking", desc: "Check in with your feelings and spot patterns in your emotional wellbeing." },
            { icon: Sparkles, title: "Guided Reflection", desc: "Use prompts to structure your post-session thoughts for deeper insight." },
            { icon: TrendingUp, title: "Goal Progress", desc: "Visualize your growth, track goals, and celebrate achievements." }
          ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-2xl border shadow-md space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/30 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="container py-12 border-t text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.
      </footer>
    </div>
  )
}
