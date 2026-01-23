import { Button } from '@/components/ui/button'
import { blink } from '@/lib/blink'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const handleLogin = () => blink.auth.login(window.location.origin)

  const features = [
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your data is encrypted and secure. Your reflections are for your eyes only.',
    },
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Check in with yourself daily to see patterns in your emotional well-being.',
    },
    {
      icon: Sparkles,
      title: 'Guided Reflection',
      description: 'Structure your post-session thoughts with guided prompts for deeper insights.',
    },
    {
      icon: TrendingUp,
      title: 'Goal Progress',
      description: 'Visualize your growth with goal tracking and celebrate your achievements.',
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container flex h-20 items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Therapy Pathways</h1>
        <Button variant="ghost" onClick={handleLogin}>
          Log in
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container py-20 md:py-32 flex flex-col items-center text-center space-y-8"
        >
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Your journey to personal growth
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-[800px] leading-tight">
            The companion your therapy journey deserves.
          </h2>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Track progress, log reflections, and organize your thoughts between sessions. Empowering you to get the most out of every conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base"
              onClick={handleLogin}
              asChild={false}
            >
              Start your journey
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Learn more
            </Button>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="container py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="p-6 rounded-2xl border bg-card space-y-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center mx-auto">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="container py-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Therapy Pathways. All rights reserved.</p>
      </footer>
    </div>
  )
}
