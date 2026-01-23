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


  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LandingPage />
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/check-in/:appointmentId" element={<CheckInPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
