import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) return console.error('Login error:', error.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-aqua-100 p-6 sm:p-12 flex flex-col">
      
      <header className="flex items-center justify-between mb-12">
        <span className="text-2xl md:text-3xl font-bold text-gray-900">Therapy Pathways</span>
        <div className="flex gap-4">
          <Button onClick={handleLogin}>Log in</Button>
          <Button onClick={() => navigate('/learn-more')}>Learn More</Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center space-y-12 text-center">
        <section className="max-w-3xl space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Your Therapy Companion
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress, check in daily, and get the most out of your therapy journey.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {[
            { icon: Shield, title: "Private & Secure", desc: "Your reflections and progress are stored securely, for your eyes only." },
            { icon: Heart, title: "Mood Tracking", desc: "Daily check-ins help you notice patterns in your well-being." },
            { icon: Sparkles, title: "Guided Reflection", desc: "Structured prompts make post-session insights easy." },
            { icon: TrendingUp, title: "Goal Progress", desc: "Celebrate small wins and track your growth." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white backdrop-blur-md shadow-md space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/20">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <Button size="lg" className="h-12 px-8 text-base" onClick={handleLogin}>Start Your Journey</Button>
          <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/learn-more')}>Learn More</Button>
        </section>
      </main>

      <footer className="mt-auto text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.
      </footer>
    </div>
  )
}
