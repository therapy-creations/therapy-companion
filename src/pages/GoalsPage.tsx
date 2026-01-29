import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'

export default function GoalsPage() {
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState<any[]>([])
  const [newGoal, setNewGoal] = useState('')

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const user = supabase.auth.user()
      if (!user) return
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setGoals(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return
    try {
      const user = supabase.auth.user()
      if (!user) return
      const { error } = await supabase.from('goals').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        title: newGoal.trim(),
        is_completed: 0
      })
      if (error) throw error
      setNewGoal('')
      toast.success('Goal added')
      fetchGoals()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add goal')
    }
  }

  const handleToggleComplete = async (goal: any) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ is_completed: goal.is_completed ? 0 : 1 })
        .eq('id', goal.id)
      if (error) throw error
      fetchGoals()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update goal')
    }
  }

   // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Goals</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="h-12"
            />
            <Button onClick={handleAddGoal} className="h-12 px-8">Add</Button>
          </div>
        </CardContent>
      </Card>

      {goals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
          <p className="text-muted-foreground">No goals yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="flex items-center justify-between">
              <CardContent className="flex items-center justify-between w-full p-6">
                <p className={goal.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}>{goal.title}</p>
                <Button variant="outline" size="sm" onClick={() => handleToggleComplete(goal)} className="h-10 px-6">
                  {goal.is_completed ? 'Undo' : 'Complete'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
