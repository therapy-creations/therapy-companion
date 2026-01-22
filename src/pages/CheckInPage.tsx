import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blink } from '@/lib/blink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Save, 
  Smile, 
  Frown, 
  Meh, 
  Wind, 
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { Progress } from '@/components/ui/progress'

const steps = [
  { title: 'Current State', description: 'How are you feeling after your session?' },
  { title: 'Key Takeaways', description: 'What were the most important points discussed?' },
  { title: 'Topics Covered', description: 'What specific topics did you dive into today?' },
  { title: 'Looking Forward', description: 'What progress did you make and what are the next steps?' }
]

export default function CheckInPage() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [appointment, setAppointment] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    feeling: '',
    takeaways: '',
    topicsDiscussed: '',
    progress: ''
  })

  useEffect(() => {
    if (appointmentId) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [appointmentId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await blink.db.appointments.get(appointmentId!)
      if (data) {
        setAppointment(data)
        
        // Check if reflection already exists
        const reflections = await blink.db.session_reflections.list({
          where: { appointment_id: appointmentId! }
        })
        
        if (reflections.length > 0) {
          const r = reflections[0]
          setFormData({
            feeling: r.feeling || '',
            takeaways: r.takeaways || '',
            topicsDiscussed: r.topics_discussed || '',
            progress: r.progress || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching reflection data:', error)
      toast.error('Failed to load session data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { user } = await blink.auth.me()
      if (!user) return

      const existing = await blink.db.session_reflections.list({
        where: { appointment_id: appointmentId || 'manual' }
      })

      const reflectionData = {
        user_id: user.id,
        appointment_id: appointmentId || 'manual',
        feeling: formData.feeling,
        takeaways: formData.takeaways,
        topics_discussed: formData.topicsDiscussed,
        progress: formData.progress,
        created_at: new Date().toISOString()
      }

      if (existing.length > 0) {
        await blink.db.session_reflections.update(existing[0].id, reflectionData)
      } else {
        await blink.db.session_reflections.create({
          id: crypto.randomUUID(),
          ...reflectionData
        })
      }

      toast.success('Reflection saved successfully')
      navigate('/sessions')
    } catch (error) {
      console.error('Error saving reflection:', error)
      toast.error('Failed to save reflection')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {appointment && (
          <Badge variant="outline">
            Session: {format(parseISO(appointment.date), 'MMM do, yyyy')}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{steps[currentStep].title}</h1>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of 4</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="min-h-[300px] flex flex-col">
        <CardContent className="flex-1 pt-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <Label>How are you feeling after this session?</Label>
              <Textarea 
                placeholder="Exhausted but hopeful, relieved, frustrated..." 
                className="min-h-[200px] text-lg resize-none"
                value={formData.feeling}
                onChange={(e) => setFormData(prev => ({ ...prev, feeling: e.target.value }))}
              />
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>What were your key takeaways?</Label>
              <Textarea 
                placeholder="What did you learn about yourself today? What clicked?" 
                className="min-h-[200px] text-lg resize-none"
                value={formData.takeaways}
                onChange={(e) => setFormData(prev => ({ ...prev, takeaways: e.target.value }))}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>What topics were discussed?</Label>
              <Textarea 
                placeholder="Family patterns, boundaries at work, coping with anxiety..." 
                className="min-h-[200px] text-lg resize-none"
                value={formData.topicsDiscussed}
                onChange={(e) => setFormData(prev => ({ ...prev, topicsDiscussed: e.target.value }))}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Label>What progress did you make and what's next?</Label>
              <Textarea 
                placeholder="I successfully spoke up for myself. Next week I want to focus on..." 
                className="min-h-[200px] text-lg resize-none"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: e.target.value }))}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t py-4">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {isLastStep ? (
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Complete Reflection
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep(prev => prev + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {currentStep === 3 && (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 animate-fade-in">
          <CheckCircle2 className="h-12 w-12 text-primary" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">You're doing great.</h3>
            <p className="text-muted-foreground">Self-reflection is a powerful tool for growth. Take a moment to breathe and acknowledge the work you did today.</p>
          </div>
        </div>
      )}
    </div>
  )
}
