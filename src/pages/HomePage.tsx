import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [dailyCheckIn, setDailyCheckIn] = useState<{ mood: string; focus: string } | null>(null)
  const [mood, setMood] = useState('')
  const [focus, setFocus] = useState('')

  const [user, setUser] = useState<any>(null)

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      setLoading(false)
    }
    loadUser()
  }, [])

  // Fetch today's check-in
  useEffect(() => {
    if (!user) return

    const fetchCheckIn = async () => {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (!error && data) {
        setDailyCheckIn({ mood: data.mood, focus: data.focus })
        setMood(data.mood)
        setFocus(data.focus)
      }

      setLoading(false)
    }

    fetchCheckIn()
  }, [user])

  const handleSubmitCheckIn = async () => {
    if (!user) return

    if (!mood || !focus) {
      toast.error('Please fill out both fields')
      return
    }

    const today = new Date().toISOString().split('T')[0]

    try {
      const { error } = await supabase
        .from('daily_check_ins')
        .upsert({
          user_id: user.id,
          date: today,
          mood,
          focus
        })

      if (error) throw error

      toast.success('Daily check-in saved!')
      setDailyCheckIn({ mood, focus })
    } catch (err) {
      console.error(err)
      toast.error('Failed to save check-in')
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f7fa] via-[#cfe8fc] to-[#f0f8ff] flex flex-col items-center py-20 px-4 sm:px-6 lg:px-12">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-8 text-primary-foreground drop-shadow-md">
        Welcome Back, {user?.email || 'Therapy Companion'}!
      </h1>

      <Card className="w-full max-w-xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Daily Check-In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mood">How are you feeling today?</Label>
            <Input
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., happy, anxious, calm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="focus">What are you focusing on today?</Label>
            <Input
              id="focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g., mindfulness, work, self-care"
            />
          </div>
          <Button className="w-full mt-2" onClick={handleSubmitCheckIn}>
            {dailyCheckIn ? 'Update Check-In' : 'Submit Check-In'}
          </Button>
        </CardContent>
      </Card>

      <section className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-md">
          <CardHeader>
            <CardTitle>Track Your Mood</CardTitle>
          </CardHeader>
          <CardContent>
            Use your daily check-ins to spot patterns and notice trends in your emotional well-being over time.
          </CardContent>
        </Card>
        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-md">
          <CardHeader>
            <CardTitle>Focus & Goals</CardTitle>
          </CardHeader>
          <CardContent>
            Reflect on what matters most each day. Keep your therapy work active between sessions and track your growth.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
