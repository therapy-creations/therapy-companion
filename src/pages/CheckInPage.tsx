import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'

export default function CheckInPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchSession()
  }, [])

  const fetchSession = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', sessionId)
        .single()
      if (error) throw error
      setSession(data)
      setNotes(data?.notes || '')
    } catch (err) {
      console.error(err)
      toast.error('Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ notes })
        .eq('id', sessionId)
      if (error) throw error
      toast.success('Check-in saved!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save check-in')
    }
  }

  if (loading) return <Loader size="lg" className="mx-auto mt-20" />

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>{session?.status === 'completed' ? 'Reflection' : 'Prepare for Session'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="font-medium">Notes / Focus Points</label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-32 resize-none"
              as="textarea"
            />
          </div>
          <Button onClick={handleSave}>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
