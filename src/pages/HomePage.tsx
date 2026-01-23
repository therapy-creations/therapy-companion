import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MessageSquare, Target, Heart } from 'lucide-react'

export default function HomePage() {
  const cards = [
    { title: 'Sessions', icon: <Calendar className="h-5 w-5" />, link: '/sessions' },
    { title: 'Topics', icon: <MessageSquare className="h-5 w-5" />, link: '/topics' },
    { title: 'Goals', icon: <Target className="h-5 w-5" />, link: '/goals' },
    { title: 'Journal', icon: <Heart className="h-5 w-5" />, link: '/journal' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
      <p className="text-muted-foreground">Pick a section to continue your therapy journey.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center gap-2">
              {card.icon}
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={card.link}>Go</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
