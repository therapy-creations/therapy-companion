import { Button } from '@/components/ui/button'
import { Heart, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
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
      const {
        data: { user }
      } = await supabase.auth.getUser()
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
      const {
        data: { user }
      } = await supabase.auth.getUser()
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
    <div className="space-y-8 animate-fade-in">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Welcome to your Therapy Companion
        </h1>
        <p className="text-gray-600 text-lg">Take a moment to check in with yourself</p>
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
              <p className="text-sm text-gray-500 italic">
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
              <Button size="lg" className="w-full h-12 text-base" onClick={handleSubmitCheckIn}>
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links Section */}
      <section className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/sessions', title: 'Sessions' },
            { href: '/journal', title: 'Journal' },
            { href: '/goals', title: 'Goals' },
            { href: '/topics', title: 'Topics' },
          ].map((link, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-bold tracking-tight text-gray-900 mb-3">{link.title}</CardTitle>
                <Button asChild className="h-10 w-full">
                  <a href={link.href}>
                    Go to {link.title}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
