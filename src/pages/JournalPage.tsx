import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  BookOpen, 
  Plus, 
  Sparkles, 
  Trash2, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const journalPrompts = [
  "What is one small boundary you can set for yourself today?",
  "What physical sensations did you notice during a difficult moment today?",
  "Describe a situation where you used a healthy coping skill.",
  "What patterns are you noticing in your relationships lately?",
  "If your inner critic was a separate person, what would they be saying right now?",
  "What does 'self-care' actually feel like to you, beyond the clichés?",
  "Write about a moment this week when you felt truly seen or understood.",
  "What is something you're avoiding talking about in therapy? Why?",
]

export default function JournalPage() {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<any[]>([])
  const [isWriting, setIsWriting] = useState(false)
  const [content, setContent] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEntries()
    generateRandomPrompt()
  }, [])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const { user } = await blink.auth.me()
      if (!user) return

      const data = await blink.db.journal_entries.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      
      setEntries(data)
    } catch (error) {
      console.error('Error fetching entries:', error)
      toast.error('Failed to load journal entries')
    } finally {
      setLoading(false)
    }
  }

  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length)
    setCurrentPrompt(journalPrompts[randomIndex])
  }

  const handleSaveEntry = async () => {
    if (!content.trim()) return

    try {
      const { user } = await blink.auth.me()
      if (!user) return

      await blink.db.journal_entries.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        content: content.trim(),
        prompt: isWriting ? currentPrompt : null,
        created_at: new Date().toISOString()
      })

      setContent('')
      setIsWriting(false)
      toast.success('Journal entry saved')
      fetchEntries()
    } catch (error) {
      console.error('Error saving entry:', error)
      toast.error('Failed to save entry')
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await blink.db.journal_entries.delete(id)
      toast.success('Entry removed')
      fetchEntries()
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast.error('Failed to remove entry')
    }
  }

  const filteredEntries = entries.filter(e => 
    e.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.prompt && e.prompt.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Personal Journal</h1>
          <p className="text-muted-foreground">A safe space for your reflections, patterns, and growth.</p>
        </div>
        {!isWriting && (
          <Button onClick={() => { setIsWriting(true); generateRandomPrompt(); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        )}
      </div>

      {isWriting ? (
        <Card className="border-2 border-primary shadow-lg animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Guided Reflection
                </CardTitle>
                <CardDescription className="text-base italic text-foreground/80">
                  "{currentPrompt}"
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={generateRandomPrompt} className="shrink-0">
                New prompt
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start writing here..."
              className="min-h-[300px] text-lg resize-none border-none focus-visible:ring-0 p-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />
          </CardContent>
          <div className="p-4 border-t flex justify-between items-center bg-muted/30">
            <Button variant="ghost" onClick={() => setIsWriting(false)}>Cancel</Button>
            <Button onClick={handleSaveEntry} disabled={!content.trim()}>
              Save Reflection
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search your entries..." 
              className="pl-10 h-11 bg-muted/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
              <JournalEntryCard 
                key={entry.id} 
                entry={entry} 
                onDelete={handleDeleteEntry} 
              />
            )) : (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
                <BookOpen className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-medium">No entries found</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                  Start writing to track your thoughts and feelings over time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function JournalEntryCard({ entry, onDelete }: { entry: any, onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const date = parseISO(entry.created_at)

  return (
    <Card className="overflow-hidden group hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(date, 'MMMM do, yyyy')} • {format(date, 'h:mm a')}
            </div>
            {entry.prompt && (
              <p className="text-sm font-semibold italic text-primary/80 line-clamp-1">
                Prompt: {entry.prompt}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </CardHeader>
      <CardContent 
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isExpanded ? "pb-6 opacity-100 h-auto" : "pb-0 opacity-0 h-0"
        )}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </p>
      </CardContent>
      {!isExpanded && (
        <CardContent className="pb-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 italic">
            {entry.content}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
