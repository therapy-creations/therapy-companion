import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) {
      console.error('Login error:', error.message)
      return
    }
  }

  return (
    <div className="landing-background min-h-screen flex flex-col">
      <header className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Therapy Pathways</span>
        </div>
        <Button variant="ghost" onClick={handleLogin}>Log in with Google</Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-0">
        <section className="animate-fade-in space-y-6">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Your trusted companion between therapy sessions
          </div>

          <h1 className="landing-glow font-bold tracking-tight max-w-[800px] leading-tight">
            The therapy companion that helps you reflect, grow, and heal.
          </h1>

          <p className="text-muted-foreground max-w-[600px]">
            Track your progress, organize your thoughts, and empower yourself in between sessions. Therapy support wherever you go.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base" onClick={handleLogin}>
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Learn More
            </Button>
          </div>
        </section>

        <section className="container py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "Private & Secure", desc: "Your data is encrypted and secure. Reflections are only for you." },
            { icon: Heart, title: "Mood Tracking", desc: "Check in daily to see patterns in your emotional well-being." },
            { icon: Sparkles, title: "Guided Reflection", desc: "Structure your post-session thoughts for deeper insights." },
            { icon: TrendingUp, title: "Goal Progress", desc: "Visualize your growth and celebrate your achievements." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-card shadow-md space-y-4 glass">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="container py-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.</p>
      </footer>
    </div>
  )
}
