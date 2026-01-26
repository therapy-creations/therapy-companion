import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import LearnMorePage from './pages/LearnMorePage'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import CheckInPage from './pages/CheckInPage'
import TopicsPage from './pages/TopicsPage'
import GoalsPage from './pages/GoalsPage'
import JournalPage from './pages/JournalPage'
import ProfilePage from './pages/ProfilePage'
import { Spinner } from './components/ui/spinner'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])

  // Load session on startup & listen for auth changes
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.unsubscribe()
  }, [])

  // Fetch appointments for logged-in user
  useEffect(() => {
    if (!user) return

    const fetchAppointments = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (!error) setAppointments(data ?? [])
      setLoading(false)
    }

    fetchAppointments()
  }, [user])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route
              path="/check-in"
              element={<CheckInPage appointments={appointments} />}
            />
            <Route
              path="/check-in/:appointmentId"
              element={<CheckInPage appointments={appointments} />}
            />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  )
}
