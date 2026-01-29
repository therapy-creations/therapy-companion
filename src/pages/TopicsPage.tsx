import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

export default function TopicsPage() {
  const [loading, setLoading] = useState(true)
  const [topics, setTopics] = useState<any[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTopics(data || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
      toast.error('Failed to load topics')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('topics').insert([
        {
          user_id: user.id,
          title: newTitle.trim(),
          priority: newPriority,
          is_completed: false
        }
      ])

      if (error) throw error

      setNewTitle('')
      setNewPriority('medium')
      toast.success('Topic added')
      fetchTopics()
    } catch (error) {
      console.error('Error adding topic:', error)
      toast.error('Failed to add topic')
    }
  }

  const handleToggleComplete = async (topic: any) => {
    try {
      const { error } = await supabase
        .from('topics')
        .update({ is_completed: !topic.is_completed })
        .eq('id', topic.id)

      if (error) throw error
      fetchTopics()
    } catch (error) {
      console.error('Error updating topic:', error)
      toast.error('Failed to update topic')
    }
  }

  const handleDeleteTopic = async (id: string) => {
    try {
      const { error } = await supabase.from('topics').delete().eq('id', id)
      if (error) throw error
      toast.success('Topic removed')
      fetchTopics()
    } catch (error) {
      console.error('Error deleting topic:', error)
      toast.error('Failed to remove topic')
    }
  }

  const priorityColors: Record<string, string> = {
    high: 'text-red-500 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-blue-500 bg-blue-50 border-blue-200',
  }

  const activeTopics = topics.filter(t => !t.is_completed)
  const completedTopics = topics.filter(t => t.is_completed)

   // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Topics to Discuss</h1>
        <p className="text-gray-600">Things you want to talk about in your next session.</p>
      </div>

      <Card className="border-2">
        <CardContent className="p-6">
          <form onSubmit={handleAddTopic} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="What's on your mind?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="flex gap-2">
              <Select value={newPriority} onValueChange={setNewPriority}>
                <SelectTrigger className="w-[120px] h-12">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="icon" className="h-12 w-12 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Active Topics ({activeTopics.length})
          </h2>
          {activeTopics.length > 0 ? activeTopics.map((topic) => (
            <Card key={topic.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center px-4 py-4 gap-4">
                  <button 
                    onClick={() => handleToggleComplete(topic)}
                    className="shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Circle className="h-6 w-6" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-lg truncate">{topic.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 py-0", priorityColors[topic.priority])}>
                        {topic.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-gray-50">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 text-gray-400 opacity-50" />
              <p className="text-gray-600">No topics saved yet. Add something above!</p>
            </div>
          )}
        </div>

        {completedTopics.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Discussed
            </h2>
            {completedTopics.map((topic) => (
              <div 
                key={topic.id} 
                className="flex items-center px-4 py-3 gap-4 bg-gray-100 rounded-xl border border-transparent group"
              >
                <button 
                  onClick={() => handleToggleComplete(topic)}
                  className="shrink-0 text-blue-600"
                >
                  <CheckCircle2 className="h-6 w-6" />
                </button>
                <p className="flex-1 text-gray-500 line-through decoration-gray-400">{topic.title}</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
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
