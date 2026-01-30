import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/Loader'
import { User, Mail, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  // Show loader while loading
  if (loading) return <Loader />

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="space-y-2">
                <Label className="text-gray-900">Email</Label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">User ID</Label>
                <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {user.id}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Account Created</Label>
                <p className="text-sm text-gray-600">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date not available'}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            Your therapy data is private and secure. All journal entries, goals, and sessions are encrypted and accessible only to you.
          </p>
          <p className="text-sm text-gray-600">
            We never share your personal information or therapy data with third parties.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
