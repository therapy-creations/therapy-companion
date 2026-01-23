import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import CheckInPage from './pages/CheckInPage'
import TopicsPage from './pages/TopicsPage'
import GoalsPage from './pages/GoalsPage'
import JournalPage from './pages/JournalPage'
import ProfilePage from './pages/ProfilePage'
import { Spinner } from './components/ui/spinner'
import { supabase } from './lib/supabase'

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])

  // Check auth on load
  useEffect(() => {
    const sessionUser = supabase.auth.user()
    setUser(sessionUser)
    setIsLoading(false)

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  // Example: fetch appointments for logged-in user
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        if (error) throw error
        setAppointments(data)
      } catch (err) {
        console.error('Error fetching appointments:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [user])

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/check-in" element={<CheckInPage appointments={appointments} />} />
          <Route path="/check-in/:appointmentId" element={<CheckInPage appointments={appointments} />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
