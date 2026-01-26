import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [checkIn, setCheckIn] = useState<any>(null)

  // Daily check-in state
  const [mood, setMood] = useState('')
  const [focus, setFocus] = useState('')
  const [energy, setEnergy] = useState(5)
  const [stress, setStress] = useState(5)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      // Fetch today's check-in
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()
      
      if (data) {
        setCheckIn(data)
        setMood(data.mood)
        setFocus(data.focus)
        setEnergy(data.energy)
        setStress(data.stress)
        setNotes(data.notes ?? '')
      }

      setLoading(false)
    }

    loadUser()
  }, [])

  const handleSubmit = async () => {
    if (!mood || !focus) {
      toast.error('Please fill out mood and focus')
      return
    }

    try {
      setSaving(true)
      const today = new Date().toISOString().split('T')[0]

      const payload = {
        user_id: user.id,
        date: today,
        mood,
        focus,
        energy,
        stress,
        notes
      }

      if (checkIn) {
        // Update existing
        const { error } = await supabase
          .from('daily_checkins')
          .update(payload)
          .eq('id', checkIn.id)
        if (error) throw error
        toast.success('Check-in updated!')
      } else {
        // Insert new
        const { error } = await supabase
          .from('daily_checkins')
          .insert([payload])
        if (error) throw error
        toast.success('Daily check-in saved!')
        setCheckIn(payload)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to save check-in')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#dbeafe] via-[#e0f2fe] to-[#f0f9ff] animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900">Welcome back, {user?.email}</h1>
        <p className="text-center text-blue-800">Your companion for in-between sessions. Track your mood, focus, and energy daily.</p>

        {/* Daily Check-In Card */}
        <div className="bg-white/70 dark:bg-blue-900/40 backdrop-blur-md rounded-3xl p-6 shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold text-blue-900 dark:text-white">Daily Check-In</h2>

          <div>
            <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">Mood</label>
            <select
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 bg-white dark:bg-blue-800 text-blue-900 dark:text-white"
            >
              <option value="">Select mood</option>
              <option value="happy">😃 Happy</option>
              <option value="content">🙂 Content</option>
              <option value="neutral">😐 Neutral</option>
              <option value="sad">😟 Sad</option>
              <option value="angry">😠 Angry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">Focus / Intention</label>
            <input
              type="text"
              value={focus}
              onChange={e => setFocus(e.target.value)}
              placeholder="What are you focusing on today?"
              className="mt-1 w-full border rounded-lg p-2 bg-white dark:bg-blue-800 text-blue-900 dark:text-white"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">Energy</label>
              <input
                type="range"
                min={0}
                max={10}
                value={energy}
                onChange={e => setEnergy(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-blue-700 dark:text-blue-300 text-right">{energy}/10</div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">Stress</label>
              <input
                type="range"
                min={0}
                max={10}
                value={stress}
                onChange={e => setStress(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-blue-700 dark:text-blue-300 text-right">{stress}/10</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Reflections or thoughts..."
              className="mt-1 w-full border rounded-lg p-2 bg-white dark:bg-blue-800 text-blue-900 dark:text-white"
            />
          </div>

          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : checkIn ? 'Update Check-In' : 'Submit Check-In'}
          </Button>
        </div>

        {/* Optional: Add recent check-ins, progress, or tips */}
        {checkIn && (
          <div className="bg-white/50 dark:bg-blue-900/40 backdrop-blur-md rounded-3xl p-4 shadow-md text-blue-900 dark:text-white space-y-2">
            <h3 className="font-semibold text-lg">Your Check-In Today</h3>
            <p>Mood: {checkIn.mood}</p>
            <p>Focus: {checkIn.focus}</p>
            <p>Energy: {checkIn.energy}/10 | Stress: {checkIn.stress}/10</p>
            {checkIn.notes && <p>Notes: {checkIn.notes}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
