"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"

export default function CourseSelectionPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  const api = import.meta.env.VITE_BACKEND_API
  console.log("API URL:", api)

  useEffect(() => {
    fetch(`${api}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
  }, [])

  const selectCourse = (courseId: string) => {
    localStorage.setItem("selectedCourse", courseId)
    navigate(`/courses/${courseId}/`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <header className="p-4 flex items-center space-x-4">
        <Button variant="ghost" className="text-white p-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Course Selection</h1>
          <p className="text-white">Select a course and begin your journey.</p>
        </div>
      </header>
      <main className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((course: any) => {
            const imageUrl = course.image ? course.image : `https://picsum.photos/seed/${course._id}/300/200`
            return (
              <div
                key={course.id}
                onClick={() => selectCourse(course.id)}
                className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <img src={imageUrl} alt={course.title} className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                  <p className="text-gray-600 mt-2">
                    {course.description ? course.description : "No description available."}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

