import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarIcon, Plus, CheckCircle2, Clock, MoreVertical, ChevronRight, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function SessionsPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSession = async () => {
    if (!newDate || !newTime) {
      toast.error('Please select both date and time')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const dateTime = `${newDate}T${newTime}:00`

      const { error } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          date: dateTime,
          notes: newNotes,
          status: 'scheduled'
        }])

      if (error) throw error

      toast.success('Session scheduled successfully')
      setIsAddOpen(false)
      setNewDate('')
      setNewTime('')
      setNewNotes('')
      fetchAppointments()
    } catch (error) {
      console.error('Error adding session:', error)
      toast.error('Failed to schedule session')
    }
  }

  const handleMarkComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', id)

      if (error) throw error
      toast.success('Session marked as complete')
      fetchAppointments()
    } catch (error) {
      console.error('Error updating session:', error)
      toast.error('Failed to update session')
    }
  }

  const handleDeleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Session removed')
      fetchAppointments()
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to remove session')
    }
  }

  const upcomingSessions = appointments.filter(a => a.status === 'scheduled')
  const pastSessions = appointments.filter(a => a.status !== 'scheduled')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Your Sessions</h1>
          <p className="text-muted-foreground">Keep track of your therapy appointments and progress.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>Enter the details for your next therapy appointment.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Focus topics, preparation..." value={newNotes} onChange={e => setNewNotes(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSession}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming
        </h2>
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session, index) => {
              const isNext = index === upcomingSessions.length - 1
              return (
                <Card key={session.id} className={isNext ? "border-primary" : ""}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{format(parseISO(session.date), 'EEEE, MMM do')}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(parseISO(session.date), 'h:mm a')}
                      </CardDescription>
                    </div>
                    {isNext && <Badge>Next Session</Badge>}
                  </CardHeader>
                  <CardContent className="pb-4">
                    {session.notes && <p className="text-sm text-muted-foreground line-clamp-2 italic">"{session.notes}"</p>}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSession(session.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Session
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/check-in/${session.id}`}>Prepare</Link>
                      </Button>
                      <Button size="sm" onClick={() => handleMarkComplete(session.id)}>Mark Complete</Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
            <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Past Sessions
        </h2>
        <div className="space-y-3">
          {pastSessions.length > 0 ? pastSessions.map((session) => (
            <Card key={session.id} className="hover:bg-muted/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{format(parseISO(session.date), 'MMMM do, yyyy')}</h4>
                    <p className="text-xs text-muted-foreground">Completed at {format(parseISO(session.date), 'h:mm a')}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group" asChild>
                  <Link to={`/check-in/${session.id}`}>
                    Reflections
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">No past sessions yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
