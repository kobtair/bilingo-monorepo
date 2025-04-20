"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BookOpen, Mic, TrendingUp } from "lucide-react"


export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Welcome to BiLinGo</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Pick up where you left off</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                onClick={() => navigate("/lessons")}
              >
                <BookOpen className="h-5 w-5" />
                Resume Lesson
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Speaking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Record your voice and get feedback</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                onClick={() => navigate("/practice")}
              >
                <Mic className="h-5 w-5" />
                Start Recording
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Track your learning journey</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                onClick={() => navigate("/progress")}
              >
                <TrendingUp className="h-5 w-5" />
                View Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

