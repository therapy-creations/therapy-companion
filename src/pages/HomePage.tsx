import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  MessageSquare, 
  Target, 
  BookOpen, 
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Wind,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { format, isAfter, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

const moodEmojis = [
  { icon: Smile, label: 'Calm', value: 'calm', color: 'text-green-500 bg-green-50' },
  { icon: Zap, label: 'Energetic', value: 'energetic', color: 'text-yellow-500 bg-yellow-50' },
  { icon: Meh, label: 'Okay', value: 'okay', color: 'text-blue-500 bg-blue-50' },
  { icon: Wind, label: 'Anxious', value: 'anxious', color: 'text-purple-500 bg-purple-50' },
  { icon: Frown, label: 'Sad', value: 'sad', color: 'text-red-500 bg-red-50' },
]

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [nextAppointment, setNextAppointment] = useState<any>(null)
  const [stats, setStats] = useState({
    sessions: 0,
    topics: 0,
    goals: 0
  })
  const [todayMood, setTodayMood] = useState<string | null>(null)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const { user } = await blink.auth.me()
      if (!user) return

      // Fetch next appointment
      const appointments = await blink.db.appointments.list({
        where: { user_id: user.id, status: 'scheduled' },
        orderBy: { date: 'asc' },
        limit: 1
      })
      
      if (appointments.length > 0) {
        setNextAppointment(appointments[0])
      }

      // Fetch stats
      const [sessionsCount, topicsCount, goalsCount] = await Promise.all([
        blink.db.appointments.count({ where: { user_id: user.id, status: 'completed' } }),
        blink.db.topics.count({ where: { user_id: user.id, is_completed: "0" } }),
        blink.db.goals.count({ where: { user_id: user.id, is_completed: "1" } })
      ])

      setStats({
        sessions: sessionsCount,
        topics: topicsCount,
        goals: goalsCount
      })

      // Fetch today's mood
      const today = new Date().toISOString().split('T')[0]
      const moods = await blink.db.mood_logs.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' },
        limit: 1
      })

      if (moods.length > 0) {
        const lastMoodDate = new Date(moods[0].created_at).toISOString().split('T')[0]
        if (lastMoodDate === today) {
          setTodayMood(moods[0].mood)
        }
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSelect = async (mood: string) => {
    try {
      const { user } = await blink.auth.me()
      if (!user) return

      await blink.db.mood_logs.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        mood,
        created_at: new Date().toISOString()
      })

      setTodayMood(mood)
      toast.success('Mood logged for today')
    } catch (error) {
      console.error('Error logging mood:', error)
      toast.error('Failed to log mood')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Here is an overview of your therapy journey.</p>
      </section>

      {/* Next Appointment Card */}
      <section>
        {nextAppointment ? (
          <Card className="border-2 border-primary/10 overflow-hidden">
            <div className="bg-primary/5 px-6 py-2 border-b flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary/70">Next Session</span>
              <Badge variant="secondary" className="bg-white">Scheduled</Badge>
            </div>
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{format(parseISO(nextAppointment.date), 'EEEE, MMMM do')}</h3>
                  <p className="text-muted-foreground">{format(parseISO(nextAppointment.date), 'h:mm a')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to={`/check-in/${nextAppointment.id}`}>Prepare</Link>
                </Button>
                <Button asChild>
                  <Link to="/sessions">View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">No upcoming sessions</CardTitle>
              <CardDescription>Schedule your next session to keep the momentum going.</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link to="/sessions">Schedule Session</Link>
            </Button>
          </Card>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mood Check-in */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>A quick check-in to track your emotional well-being.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {moodEmojis.map((mood) => {
                  const isSelected = todayMood === mood.value
                  return (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      disabled={!!todayMood}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all w-[90px]",
                        isSelected ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted",
                        todayMood && !isSelected && "opacity-50 grayscale"
                      )}
                    >
                      <mood.icon className={cn("h-8 w-8 mb-2", mood.color.split(' ')[0])} />
                      <span className="text-xs font-medium">{mood.label}</span>
                    </button>
                  )
                })}
              </div>
              {todayMood && (
                <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Thanks for checking in today!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/check-in" className="group">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">Check-in</span>
                </CardContent>
              </Card>
            </Link>
            <Link to="/topics" className="group">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">Topics</span>
                </CardContent>
              </Card>
            </Link>
            <Link to="/goals" className="group">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">Goals</span>
                </CardContent>
              </Card>
            </Link>
            <Link to="/journal" className="group">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">Journal</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Sessions</span>
                </div>
                <span className="text-lg font-bold">{stats.sessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Topics Left</span>
                </div>
                <span className="text-lg font-bold">{stats.topics}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Goals Met</span>
                </div>
                <span className="text-lg font-bold">{stats.goals}</span>
              </div>
              <Button variant="ghost" className="w-full justify-between group" asChild>
                <Link to="/profile">
                  View full report
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Daily Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm opacity-90 leading-relaxed">
                "What is one small boundary you can set for yourself today to protect your energy?"
              </p>
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link to="/journal">Write reflection</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MoodIcon({ mood }: { mood: string }) {
  const item = moodEmojis.find(m => m.value === mood)
  if (!item) return null
  return <item.icon className={cn("h-8 w-8 mb-2", item.color.split(' ')[0])} />
}
