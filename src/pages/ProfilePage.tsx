import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Settings, 
  LogOut, 
  Camera, 
  Shield, 
  Heart, 
  Calendar,
  MessageSquare,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    sessions: 0,
    topics: 0,
    goals: 0,
    moods: 0
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    therapistName: '',
    avatarUrl: ''
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const { user } = await blink.auth.me()
      if (!user) return

      // Fetch profile
      const profiles = await blink.db.user_profiles.list({
        where: { user_id: user.id }
      })

      if (profiles.length > 0) {
        const p = profiles[0]
        setProfile(p)
        setFormData({
          displayName: p.display_name || user.email?.split('@')[0] || '',
          therapistName: p.therapist_name || '',
          avatarUrl: p.avatar_url || ''
        })
      } else {
        // Create initial profile if doesn't exist
        const initialProfile = {
          user_id: user.id,
          display_name: user.email?.split('@')[0] || 'User',
          therapist_name: '',
          avatar_url: ''
        }
        await blink.db.user_profiles.create(initialProfile)
        setProfile(initialProfile)
        setFormData({
          displayName: initialProfile.display_name,
          therapistName: '',
          avatarUrl: ''
        })
      }

      // Fetch stats
      const [sessionsCount, topicsCount, goalsCount, moodsCount] = await Promise.all([
        blink.db.appointments.count({ where: { user_id: user.id, status: 'completed' } }),
        blink.db.topics.count({ where: { user_id: user.id, is_completed: "1" } }),
        blink.db.goals.count({ where: { user_id: user.id, is_completed: "1" } }),
        blink.db.mood_logs.count({ where: { user_id: user.id } })
      ])

      setStats({
        sessions: sessionsCount,
        topics: topicsCount,
        goals: goalsCount,
        moods: moodsCount
      })
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { user } = await blink.auth.me()
      if (!user) return

      await blink.db.user_profiles.update(user.id, {
        display_name: formData.displayName,
        therapist_name: formData.therapistName,
        avatar_url: formData.avatarUrl
      })

      setProfile({
        ...profile,
        display_name: formData.displayName,
        therapist_name: formData.therapistName,
        avatar_url: formData.avatarUrl
      })
      setIsEditing(false)
      toast.success('Profile updated')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { publicUrl } = await blink.storage.upload(
        file,
        `avatars/${profile.user_id}-${Date.now()}.${file.name.split('.').pop()}`
      )
      
      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }))
      toast.success('Photo uploaded. Click save to apply.')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleLogout = () => {
    blink.auth.logout()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive border-destructive/20 hover:bg-destructive/10">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-muted">
                <AvatarImage src={formData.avatarUrl || ''} />
                <AvatarFallback className="text-4xl bg-primary/5">
                  {formData.displayName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-background">
                <Camera className="h-5 w-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.display_name}</h2>
              <p className="text-muted-foreground text-sm">Member since {new Date(profile?.created_at).getFullYear()}</p>
            </div>
            <div className="flex flex-col gap-2 w-full pt-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">Therapist:</span>
                <span className="text-muted-foreground ml-auto">{profile?.therapist_name || 'Not set'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Account Details</CardTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSave}>Save</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={formData.displayName} 
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapistName">Therapist Name</Label>
                  <Input 
                    id="therapistName" 
                    value={formData.therapistName} 
                    onChange={(e) => setFormData(prev => ({ ...prev, therapistName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Journey in Numbers</CardTitle>
              <CardDescription>A summary of your commitment to personal growth.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/30 border space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Sessions</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.sessions}</p>
                  <p className="text-[10px] text-muted-foreground">Completed therapy sessions</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Topics</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.topics}</p>
                  <p className="text-[10px] text-muted-foreground">Meaningful topics discussed</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Goals</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.goals}</p>
                  <p className="text-[10px] text-muted-foreground">Milestones achieved</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Moods</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.moods}</p>
                  <p className="text-[10px] text-muted-foreground">Daily check-ins logged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
