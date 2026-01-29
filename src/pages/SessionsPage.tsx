import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SessionsPage() {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate) {
      toast.error('Please select a date')
      return
    }

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('appointments').insert([
        {
          user_id: user.id,
          date: newDate,
          time: newTime,
          status: 'scheduled',
          notes: newNotes.trim()
        }
      ])

      if (error) throw error

      setNewDate('')
      setNewTime('')
      setNewNotes('')
      toast.success('Session scheduled')
      fetchSessions()
    } catch (error) {
      console.error('Error adding session:', error)
      toast.error('Failed to schedule session')
    }
  }

  const handleUpdateStatus = async (session: any, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', session.id)

      if (error) throw error
      toast.success('Session updated')
      fetchSessions()
    } catch (error) {
      console.error('Error updating session:', error)
      toast.error('Failed to update session')
    }
  }

  const handleDeleteSession = async (id: string) => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id)
      if (error) throw error
      toast.success('Session removed')
      fetchSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to remove session')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const scheduledSessions = sessions.filter(s => s.status === 'scheduled')
  const completedSessions = sessions.filter(s => s.status === 'completed')

  // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Therapy Sessions</h1>
        <p className="text-gray-600">Schedule and track your therapy appointments.</p>
      </div>

      <Card className="border-2">
        <CardContent className="p-6">
          <form onSubmit={handleAddSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-900 mb-2">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-900 mb-2">
                  Time (optional)
                </label>
                <Input
                  id="time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                Notes (optional)
              </label>
              <Input
                id="notes"
                placeholder="Topics to discuss..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="h-12"
              />
            </div>
            <Button type="submit" className="h-12 w-full sm:w-auto px-8">
              <Plus className="h-5 w-5 mr-2" />
              Schedule Session
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Sessions ({scheduledSessions.length})
          </h2>
          {scheduledSessions.length > 0 ? scheduledSessions.map((session) => (
            <Card key={session.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start px-4 py-4 gap-4">
                  <div className="shrink-0 text-gray-400 pt-1">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-lg text-gray-900">
                        {format(new Date(session.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                    {session.time && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                    )}
                    {session.notes && (
                      <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold px-1.5 py-0 ${getStatusColor(session.status)}`}>
                        {session.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUpdateStatus(session, 'completed')}
                        className="text-xs h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteSession(session.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-gray-50">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-gray-400 opacity-50" />
              <p className="text-gray-600">No upcoming sessions. Schedule one above!</p>
            </div>
          )}
        </div>

        {completedSessions.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Past Sessions ({completedSessions.length})
            </h2>
            {completedSessions.map((session) => (
              <div 
                key={session.id} 
                className="flex items-start px-4 py-3 gap-4 bg-gray-100 rounded-xl border border-transparent group"
              >
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {format(new Date(session.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  {session.time && (
                    <p className="text-sm text-gray-600">{session.time}</p>
                  )}
                  {session.notes && (
                    <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteSession(session.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
