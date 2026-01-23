import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  ChevronRight,
  Trash2
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'

export default function SessionsPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { user } = await blink.auth.me()
      if (!user) return

      const data = await blink.db.appointments.list({
        where: { user_id: user.id },
        orderBy: { date: 'desc' }
      })
      
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSession = async () => {
    if (!newDate || !newTime) return toast.error('Please select both date and time')
    try {
      const { user } = await blink.auth.me()
      if (!user) return

      const dateTime = `${newDate}T${newTime}:00`
      
      await blink.db.appointments.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        date: dateTime,
        notes: newNotes,
        status: 'scheduled'
      })

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
      await blink.db.appointments.update(id, { status: 'completed' })
      toast.success('Session marked as complete')
      fetchAppointments()
    } catch (error) {
      console.error('Error updating session:', error)
      toast.error('Failed to update session')
    }
  }

  const handleDeleteSession = async (id: string) => {
    try {
      await blink.db.appointments.delete(id)
      toast.success('Session removed')
      fetchAppointments()
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to remove session')
    }
  }

  const upcomingSessions = appointments.filter(a => a.status === 'scheduled')
  const pastSessions = appointments.filter(a => a.status !== 'scheduled')

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Your Sessions</h1>
          <p className="text-muted-foreground">Keep track of your therapy appointments and progress.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Schedule Session
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
                <Input id="date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Focus topics, preparation..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSession}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" /> Upcoming
        </h2>
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session, index) => {
              const isNext = index === upcomingSessions.length - 1
              return (
                <motion.div key={session.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className={`hover:shadow-lg transition-shadow ${isNext ? 'border-primary' : ''}`}>
                    <CardHeader className="pb-2 flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{format(parseISO(session.date), 'EEEE, MMM do')}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {format(parseISO(session.date), 'h:mm a')}
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
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSession(session.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Cancel Session
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
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
            <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" /> Past Sessions
        </h2>
        <div className="space-y-3">
          {pastSessions.length > 0 ? pastSessions.map((session) => (
            <motion.div key={session.id} initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="hover:bg-muted/30 transition-colors">
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
                      Reflections <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">No past sessions yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
