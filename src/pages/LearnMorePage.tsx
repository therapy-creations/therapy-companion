import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, Shield, TrendingUp } from 'lucide-react'

export default function LearnMorePage() {
  const features = [
    {
      icon: Shield,
      title: 'A trusted space between sessions.',
      description: 'Your reflections and progress are stored securely, for your eyes only.'
    },
    {
      icon: Heart,
      title: 'Daily Check-Ins',
      description: 'Easily log your thoughts, emotions, and experiences between therapy sessions to track your growth.'
    },
    {
      icon: Sparkles,
      title: 'Guided Reflections',
      description: 'Structured prompts help you process sessions, clarify thoughts, and deepen self-understanding.'
    },
    {
      icon: TrendingUp,
      title: 'Goal Tracking',
      description: 'Set meaningful goals and visualize your progress to celebrate your achievements along the way.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/70 via-purple-100/50 to-aqua-100/70 dark:from-blue-900/70 dark:via-purple-900/50 dark:to-aqua-900/70 py-12 px-6 md:px-12">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Therapy Companion</h1>
        <p className="text-xl text-muted-foreground">
          Designed by a therapist, this Therapy Pathways is meant to be your companion to therapy, supporting you between sessions, helping you track, reflect, and grow at your own pace. 
        </p>
      </header>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="p-6 rounded-2xl border bg-white/80 dark:bg-black/70 backdrop-blur-md space-y-4 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>

      <div className="text-center mt-16">
        <Link to="/">
          <Button size="lg" className="px-10 py-4">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
