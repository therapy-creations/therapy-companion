import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) {
    console.error('Login error:', error)
  }
}

    // Supabase handles redirect automatically
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Therapy Pathways</span>
        </div>
        <Button variant="ghost" onClick={handleLogin}>Log in with Google</Button>
      </header>

      <main className="flex-1">
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
          {[{icon: Shield, title: "Private & Secure", desc: "Your data is encrypted and secure. Your reflections are for your eyes only."},
            {icon: Heart, title: "Mood Tracking", desc: "Check in with yourself daily to see patterns in your emotional well-being."},
            {icon: Sparkles, title: "Guided Reflection", desc: "Structure your post-session thoughts with guided prompts for deeper insights."},
            {icon: TrendingUp, title: "Goal Progress", desc: "Visualize your growth with goal tracking and celebrate your achievements."}
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-card space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <item.icon className="h-6 w-6" />
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
