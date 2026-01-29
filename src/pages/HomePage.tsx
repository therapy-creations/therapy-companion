import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'
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

  // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
          Welcome to your Therapy Companion
        </h1>
      </header>

      {/* Daily Check-In Card */}
      <Card className="max-w-xl mx-auto p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Daily Check-In</CardTitle>
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
              <p className="text-sm text-muted-foreground italic">
                You’ve already checked in today.
              </p>
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
                  className="h-12"
                />
              </div>
              <div>
                <Label htmlFor="focus">Focus</Label>
                <Input
                  id="focus"
                  placeholder="What are you focusing on today?"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button className="w-full h-12 text-base" onClick={handleSubmitCheckIn}>
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { href: '/sessions', title: 'Sessions' },
          { href: '/journal', title: 'Journal' },
          { href: '/goals', title: 'Goals' },
          { href: '/topics', title: 'Topics' },
        ].map((link, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-bold tracking-tight">{link.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Button asChild className="h-12 px-8 text-base">
                <a href={link.href}>
                  Go to {link.title}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

    </div>
  )
}
