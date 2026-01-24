import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // redirects back to your app after login
      },
    })
    if (error) console.error('Login error:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Therapy Pathways</span>
        </div>
        <Button variant="ghost" onClick={handleLogin}>
          Log in
        </Button>
      </header>

      <main>
        <section className="container py-20 md:py-32 flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Your journey to personal growth
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-[800px] leading-tight">
            The companion your therapy journey deserves.
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Track progress, log reflections, and organize your thoughts between sessions. Empowering you to get the most out of every conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-base" onClick={handleLogin}>
              Start your journey
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Learn more
            </Button>
          </div>
        </section>

        <section className="container py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl border bg-card space-y-4">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Private & Secure</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your data is encrypted and secure. Your reflections are for your eyes only.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-4">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Mood Tracking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Check in with yourself daily to see patterns in your emotional well-being.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-4">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Guided Reflection</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Structure your post-session thoughts with guided prompts for deeper insights.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card space-y-4">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Goal Progress</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualize your growth with goal tracking and celebrate your achievements.
            </p>
          </div>
        </section>
      </main>

      <footer className="container py-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.</p>
      </footer>
    </div>
  )
}
