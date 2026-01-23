import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
  const [user, setUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    const sessionUser = supabase.auth.user()
    setUser(sessionUser)
  }, [])

  useEffect(() => {
    if (user) fetchGoals()
  }, [user])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
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
      const { error } = await supabase.from('goals').insert([{
        user_id: user.id,
        title: newTitle.trim(),
        target_progress: parseInt(targetProgress) || 100,
        current_progress: 0,
        is_completed: 0,
        created_at: new Date().toISOString()
      }])

      if (error) throw error
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
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        toast.success('Goal achieved! Congratulations!')
      }

      const { error } = await supabase
        .from('goals')
        .update({
          current_progress: newProgress,
          is_completed: isCompleted ? 1 : 0
        })
        .eq('id', goal.id)

      if (error) throw error
      fetchGoals()
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (error) throw error
      toast.success('Goal removed')
      fetchGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to remove goal')
    }
  }

  const activeGoals = goals.filter(g => Number(g.is_completed) === 0)
  const completedGoals = goals.filter(g => Number(g.is_completed) > 0)

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Spinner size="lg" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header and Add Goal Dialog */}
      {/* ... Keep the same UI code for Dialog and Cards ... */}
      {/* Replace all goal data with the Supabase-fetched `goals` array */}
    </div>
  )
}
