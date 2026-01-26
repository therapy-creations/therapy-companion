import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) {
      console.error('Login error:', error.message)
      return
    }
    // Supabase handles redirect automatically
  }

  const handleLearnMore = () => {
    navigate('/learn-more')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cce7ff] via-[#e0f7ff] to-[#f0f9ff] flex flex-col">
      <header className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-blue-800">Therapy Pathways</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleLogin}>
            Log in with Google
          </Button>
          <Button variant="outline" onClick={handleLearnMore}>
            Learn More
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-20 md:py-32 flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-white/50 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2" />
            Your essential therapy companion
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-[800px] leading-tight text-blue-900 drop-shadow-sm">
            The companion your therapy journey deserves.
          </h1>
          <p className="text-xl text-blue-800 max-w-[600px]">
            Track progress, log reflections, and organize your thoughts between sessions. Empowering you to get the most out of every conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-base" onClick={handleLogin}>
              Start your journey
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={handleLearnMore}>
              Learn More
            </Button>
          </div>
        </section>

        <section className="container py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: 'Private & Secure',
              desc: 'Your reflections and progress are stored securely, for your eyes only.'
            },
            {
              icon: Heart,
              title: 'Mood Tracking',
              desc: 'Check in with yourself daily to observe patterns and support your emotional growth.'
            },
            {
              icon: Sparkles,
              title: 'Guided Reflection',
              desc: 'Structured prompts help you process sessions deeply and effectively.'
            },
            {
              icon: TrendingUp,
              title: 'Goal Progress',
              desc: 'Visualize your growth, celebrate achievements, and stay motivated.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-white/40 backdrop-blur-sm shadow-md space-y-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-blue-900">{item.title}</h3>
              <p className="text-sm text-blue-800 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="container py-12 border-t text-center text-sm text-blue-800">
        <p>&copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.</p>
      </footer>
    </div>
  )
}
