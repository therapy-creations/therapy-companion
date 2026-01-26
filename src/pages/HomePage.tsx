import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/loader'
import { format } from 'date-fns'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState<{ mood: string; focus: string } | null>(null)
  const [mood, setMood] = useState('')
  const [focus, setFocus] = useState('')

  useEffect(() => {
    fetchDailyCheckIn()
  }, [])

  const fetchDailyCheckIn = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setCheckIn({ mood: data.mood, focus: data.focus })
      }
    } catch (error) {
      console.error('Error fetching daily check-in:', error)
      toast.error('Failed to load today’s check-in')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCheckIn = async () => {
    if (!mood || !focus) {
      toast.error('Please fill in both mood and focus')
      return
    }

    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = format(new Date(), 'yyyy-MM-dd')

      const { error } = await supabase.from('daily_checkins').upsert(
        [
          {
            user_id: user.id,
            date: today,
            mood,
            focus,
          },
        ],
        { onConflict: ['user_id', 'date'] }
      )

      if (error) throw error

      toast.success('Daily check-in saved!')
      setCheckIn({ mood, focus })
      setMood('')
      setFocus('')
    } catch (error) {
      console.error('Error saving daily check-in:', error)
      toast.error('Failed to save check-in')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-12 space-y-12 landing-gradient animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
        Welcome to your Therapy Companion
      </h1>

      {/* Daily Check-In Card */}
      <Card className="max-w-xl mx-auto glass p-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Daily Check-In</CardTitle>
          <CardDescription>
            Take a moment to reflect. How are you feeling today, and what are you focusing on?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          {checkIn ? (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Mood:</span> {checkIn.mood}
              </p>
              <p>
                <span className="font-semibold">Focus:</span> {checkIn.focus}
              </p>
              <p className="text-sm text-muted-foreground italic">You’ve already checked in today.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="mood">Mood</Label>
                <Input
                  id="mood"
                  placeholder="How are you feeling?"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="focus">Focus</Label>
                <Input
                  id="focus"
                  placeholder="What are you focusing on today?"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSubmitCheckIn}>
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optional: Add other home page content here, styled similarly to landing page */}
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="glass p-6 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Navigate to your sessions, journal, goals, and topics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild>
              <a href="/sessions">Sessions</a>
            </Button>
            <Button asChild>
              <a href="/journal">Journal</a>
            </Button>
            <Button asChild>
              <a href="/goals">Goals</a>
            </Button>
            <Button asChild>
              <a href="/topics">Topics</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
