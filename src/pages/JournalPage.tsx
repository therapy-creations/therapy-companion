import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'

export default function JournalPage() {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<any[]>([])
  const [newEntry, setNewEntry] = useState('')

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const user = supabase.auth.user()
      if (!user) return
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setEntries(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load journal entries')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return
    try {
      const user = supabase.auth.user()
      if (!user) return
      const { error } = await supabase.from('journal_entries').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        content: newEntry.trim()
      })
      if (error) throw error
      setNewEntry('')
      toast.success('Journal entry added')
      fetchEntries()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add entry')
    }
  }

   // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Journal</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Write something..."
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="h-12"
            />
            <Button onClick={handleAddEntry} className="h-12 px-8">Add</Button>
          </div>
        </CardContent>
      </Card>

      {entries.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
          <p className="text-muted-foreground">No journal entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-bold tracking-tight">
                  {new Date(entry.created_at).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-foreground">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
