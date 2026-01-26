import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [mood, setMood] = useState('')
  const [focus, setFocus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleDailyCheckIn = async () => {
    if (!mood || !focus) {
      toast.error('Please enter your mood and focus for today')
      return
    }

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      const { error } = await supabase.from('daily_checkins').upsert([
        {
          user_id: user.id,
          date: today,
          mood,
          focus
        }
      ], { onConflict: ['user_id', 'date'] })

      if (error) throw error

      toast.success('Daily check-in saved!')
      setMood('')
      setFocus('')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save check-in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/70 via-purple-100/50 to-aqua-100/70 dark:from-blue-900/70 dark:via-purple-900/50 dark:to-aqua-900/70 p-6 sm:p-12 flex flex-col space-y-12">
      
      <header className="flex justify-between items-center mb-12">
        <span className="text-2xl md:text-3xl font-bold text-primary-foreground">Therapy Pathways</span>
      </header>

      <main className="flex-1 flex flex-col items-center space-y-12 text-center">

        {/* Welcome Section */}
        <section className="max-w-3xl space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground">
            Your companion for therapy, reflection, and daily progress tracking.
          </p>
        </section>

        {/* Daily Check-In */}
        <section className="w-full max-w-md animate-fade-in">
          <Card className="p-6 bg-white/80 dark:bg-black/70 backdrop-blur-md shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-primary-foreground">Daily Check-In</h2>

            <div className="space-y-3">
              <div>
                <Label htmlFor="mood">Mood</Label>
                <Input
                  id="mood"
                  placeholder="How are you feeling today?"
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="focus">Focus</Label>
                <Input
                  id="focus"
                  placeholder="What are you focusing on today?"
                  value={focus}
                  onChange={e => setFocus(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleDailyCheckIn}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Check-In'}
              </Button>
            </div>
          </Card>
        </section>

        {/* Highlights / Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {[
            { title: "Private & Secure", desc: "Your reflections are encrypted and only visible to you." },
            { title: "Mood Tracking", desc: "Daily check-ins help you notice patterns in your well-being." },
            { title: "Guided Reflection", desc: "Structured prompts make post-session insights easy." },
            { title: "Goal Progress", desc: "Celebrate small wins and track your growth." }
          ].map((item, i) => (
            <Card
              key={i}
              className="p-6 rounded-2xl bg-white/80 dark:bg-black/70 backdrop-blur-md shadow
