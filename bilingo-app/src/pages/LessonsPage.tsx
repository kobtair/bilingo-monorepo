"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowLeft, Play, Loader } from "lucide-react" // Import Loader icon
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

// Define the type for a lesson
interface Lesson {
  _id: string
  title: string
  description: string
  details: string
}

const api = import.meta.env.VITE_BACKEND_API

export default function LessonsPage() {
  const navigate = useNavigate()
  const { id: courseId } = useParams<{ id: string }>() // Ensure courseId is a string
  const [lessons, setLessons] = useState<Lesson[]>([]) // Use Lesson[] as the type for lessons
  const [loading, setLoading] = useState<boolean>(true) // Add loading state

  useEffect(() => {
    // Fetch lessons based on courseId
    async function fetchLessons() {
      try {
        setLoading(true) // Set loading to true before fetching
        const response = await fetch(`${api}/courses/${courseId}/chapters`)
        const data: Lesson[] = await response.json() // Ensure the response is typed as Lesson[]
        setLessons(data)
      } catch (error) {
        console.error("Failed to fetch lessons:", error)
      } finally {
        setLoading(false) // Set loading to false after fetching
      }
    }
    fetchLessons()
  }, [courseId])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-4 flex items-center">
        <Button variant="ghost" className="text-white p-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-white ml-4">Choose Lesson</h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="h-8 w-8 text-white animate-spin" /> {/* Spinner */}
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-center text-white text-lg">No lessons available for this course.</p>
        ) : (
          lessons.map((lesson) => (
            <Card key={lesson._id} className="w-full">
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <p className="text-gray-500">{lesson.description}</p>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                  onClick={() => navigate(`/lessons/${lesson._id}`)}
                >
                  <Play className="h-5 w-5" />
                  Start Lesson
                </Button>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">{lesson.details}</p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

