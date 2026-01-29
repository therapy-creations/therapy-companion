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

   // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
        {session?.status === 'completed' ? 'Session Reflection' : 'Prepare for Session'}
      </h1>
      <Card>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-2xl font-bold">Notes & Focus Points</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="font-medium text-gray-900">What would you like to focus on?</label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-32 resize-none"
              as="textarea"
            />
          </div>
          <Button onClick={handleSave} className="h-12 px-8 text-base">Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
