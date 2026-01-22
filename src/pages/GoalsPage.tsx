import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Target, 
  CheckCircle2, 
  Trophy,
  MoreHorizontal,
  Trash2,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
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
import confetti from 'canvas-confetti'

export default function GoalsPage() {
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState<any[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [targetProgress, setTargetProgress] = useState('100')

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const { user } = await blink.auth.me()
      if (!user) return

      const data = await blink.db.goals.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async () => {
    if (!newTitle.trim()) return

    try {
      const { user } = await blink.auth.me()
      if (!user) return

      await blink.db.goals.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        title: newTitle.trim(),
        target_progress: parseInt(targetProgress) || 100,
        current_progress: 0,
        is_completed: 0
      })

      setIsAddOpen(false)
      setNewTitle('')
      toast.success('Goal added')
      fetchGoals()
    } catch (error) {
      console.error('Error adding goal:', error)
      toast.error('Failed to add goal')
    }
  }

  const handleUpdateProgress = async (goal: any, increment: number) => {
    try {
      const newProgress = Math.min(Math.max(Number(goal.current_progress) + increment, 0), Number(goal.target_progress))
      const isCompleted = newProgress >= Number(goal.target_progress)

      if (isCompleted && Number(goal.is_completed) === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        toast.success('Goal achieved! Congratulations!')
      }

      await blink.db.goals.update(goal.id, {
        current_progress: newProgress,
        is_completed: isCompleted ? 1 : 0
      })
      
      fetchGoals()
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      await blink.db.goals.delete(id)
      toast.success('Goal removed')
      fetchGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to remove goal')
    }
  }

  const activeGoals = goals.filter(g => Number(g.is_completed) === 0)
  const completedGoals = goals.filter(g => Number(g.is_completed) > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Therapy Goals</h1>
          <p className="text-muted-foreground">Define what you want to achieve and track your growth.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>What would you like to work on in therapy?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Title</label>
                <Input 
                  placeholder="e.g., Practicing boundaries at work" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Steps (Complexity)</label>
                <Input 
                  type="number" 
                  value={targetProgress}
                  onChange={(e) => setTargetProgress(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">How many successful applications/sessions to consider this goal met?</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeGoals.length > 0 ? activeGoals.map((goal) => {
          const progressPercent = (Number(goal.current_progress) / Number(goal.target_progress)) * 100
          return (
            <Card key={goal.id} className="relative overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center mb-2">
                    <Target className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Goal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{goal.current_progress} / {goal.target_progress} steps</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(goal, -1)}>
                  Decrease
                </Button>
                <Button size="sm" onClick={() => handleUpdateProgress(goal, 1)}>
                  Update Progress
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )
        }) : activeGoals.length === 0 && (
          <div className="md:col-span-2 text-center py-16 border-2 border-dashed rounded-3xl bg-muted/20">
            <TrendingUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-medium">No active goals</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
              Start by defining a small, achievable goal for your therapy journey.
            </p>
          </div>
        )}
      </div>

      {completedGoals.length > 0 && (
        <div className="space-y-6 pt-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="bg-muted/30 border-dashed">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Goal achieved
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
