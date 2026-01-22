import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Clock,
  MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
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
      const { user } = await blink.auth.me()
      if (!user) return

      const data = await blink.db.topics.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      
      setTopics(data)
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
      const { user } = await blink.auth.me()
      if (!user) return

      await blink.db.topics.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        title: newTitle.trim(),
        priority: newPriority,
        is_completed: 0
      })

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
      await blink.db.topics.update(topic.id, {
        is_completed: Number(topic.is_completed) > 0 ? 0 : 1
      })
      fetchTopics()
    } catch (error) {
      console.error('Error updating topic:', error)
      toast.error('Failed to update topic')
    }
  }

  const handleDeleteTopic = async (id: string) => {
    try {
      await blink.db.topics.delete(id)
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

  const activeTopics = topics.filter(t => Number(t.is_completed) === 0)
  const completedTopics = topics.filter(t => Number(t.is_completed) > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Topics to Discuss</h1>
        <p className="text-muted-foreground">Things you want to talk about in your next session.</p>
      </div>

      <Card className="border-2">
        <CardContent className="pt-6">
          <form onSubmit={handleAddTopic} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="What's on your mind?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex gap-2">
              <Select value={newPriority} onValueChange={setNewPriority}>
                <SelectTrigger className="w-[120px] h-11">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Active Topics ({activeTopics.length})
          </h2>
          {activeTopics.length > 0 ? activeTopics.map((topic) => (
            <Card key={topic.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center px-4 py-4 gap-4">
                  <button 
                    onClick={() => handleToggleComplete(topic)}
                    className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
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
            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No topics saved yet. Add something above!</p>
            </div>
          )}
        </div>

        {completedTopics.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Discussed
            </h2>
            {completedTopics.map((topic) => (
              <div 
                key={topic.id} 
                className="flex items-center px-4 py-3 gap-4 bg-muted/30 rounded-xl border border-transparent group"
              >
                <button 
                  onClick={() => handleToggleComplete(topic)}
                  className="shrink-0 text-primary"
                >
                  <CheckCircle2 className="h-6 w-6" />
                </button>
                <p className="flex-1 text-muted-foreground line-through decoration-muted-foreground/50">{topic.title}</p>
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
