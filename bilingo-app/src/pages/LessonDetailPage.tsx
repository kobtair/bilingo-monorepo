"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Play, Loader, Pause, StopCircle as Stop } from "lucide-react"
import { Button } from "../components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { updateProgress, completeChapter } from "../api/progress"
import ReactMarkdown from "react-markdown"
import { useUserStore } from "@/store/User/user"

// Define your API base url
const API_BASE = import.meta.env.VITE_BACKEND_API

export default function LessonDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [lesson, setLesson] = useState<any>(null)
  const [isLessonLoading, setIsLessonLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const recordedChunksRef = useRef<Blob[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const {user} = useUserStore()

  const lessonId = id

  useEffect(() => {
    // Fetch lesson data dynamically
    const fetchLesson = async () => {
      try {
        const response = await fetch(`${API_BASE}/chapters/${lessonId}`)
        const data = await response.json()
        setLesson(data)
      } catch (error) {
        console.error("Error fetching lesson:", error)
      } finally {
        setIsLessonLoading(false)
      }
    }
    fetchLesson()
    // Mark lesson as started
    const markLessonStarted = async () => {
      try {
        const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email
        if (userEmail) {
          await updateProgress(userEmail, Number(lessonId))
        }
      } catch (error) {
        console.error("Error updating progress:", error)
      }
    }
    markLessonStarted()
  }, [lessonId])

  // Play audio from dynamic API endpoint
  const playAudio = async () => {
    if (lesson && lesson.audio_id && audioRef.current) {
      try {
        const res = await fetch(`${API_BASE}/audio/${lesson.audio_id}`)
        const audioData = await res.json() // expecting { fileUrl: "https://..." }
        audioRef.current.src = audioData.fileUrl
        setIsPlaying(true)
        audioRef.current.play()
        audioRef.current.onended = () => setIsPlaying(false)
      } catch (err) {
        console.error("Error loading audio:", err)
      }
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Recording functionality using MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      recordedChunksRef.current = []
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false)
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" })
        try {
          const formData = new FormData()
          formData.append("audio", blob, "recording.webm")
          formData.append("audio_id", lesson.audio_id)
          // Append the user_id from localStorage

          formData.append("user_id", user?._id??"")
          setIsProcessing(true)
          const response = await fetch(`${API_BASE}/analyze`, {
            method: "POST",
            body: formData,
          })
          const result = await response.json()
          setModalData(result)
          setShowModal(true)
        } catch (error) {
          console.error("Error sending recorded audio:", error)
        } finally {
          setIsProcessing(false)
        }
      }
      mediaRecorderRef.current.stop()
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  if (isLessonLoading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 to-blue-400 items-center justify-center">
        <Loader className="animate-spin h-10 w-10 text-white" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 to-blue-400 items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Lesson not found</h1>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => navigate(-1)}>
          Back to Lessons
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-4 flex-none">
        {/* Header */}
        <Button variant="ghost" className="text-white p-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-white ml-4">{lesson.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Render lesson content as markdown */}
        <div className="prose bg-white p-4 rounded-md">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>

        {lesson.audio_id && (
          <div className="space-y-2">
            <p className="text-white">Listen and Practice</p>
            <div className="flex items-center space-x-2">
              <Button size="icon" onClick={playAudio} disabled={isPlaying}>
                <Play className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={pauseAudio} disabled={!isPlaying}>
                <Pause className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={stopAudio} disabled={!isPlaying}>
                <Stop className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={toggleRecording}
                className={`rounded-full h-16 w-16 ${isRecording ? "bg-red-600" : "bg-blue-600"} ${isRecording ? "hover:bg-red-700" : "hover:bg-blue-700"}`}
              >
                <Mic className="h-8 w-8" />
              </Button>
              <audio ref={audioRef} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex-none">
        {/* Mark as Complete button */}
        <Button
          onClick={async () => {
            try {
              setIsCompleting(true)
              const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email
              if (userEmail) {
                const result = await completeChapter(userEmail, Number(lessonId))
                if (result.success) {
                  alert("Chapter marked as complete!")
                } else {
                  throw new Error("Failed to mark as complete")
                }
              }
            } catch (error) {
              console.error("Error marking chapter complete:", error)
            } finally {
              setIsCompleting(false)
            }
          }}
          disabled={isCompleting}
        >
          Mark as Complete
        </Button>
      </div>
      {/* Modal for comparison analysis */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">💰</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Analysis Result</h2>
            <p>Similarity Ratio: {modalData.comparison.similarity_ratio}</p>
            <p>Points Gained: {modalData.comparison.points}</p>
            {/* Star rating based on similarity ratio */}
            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-2xl ${
                    index < Math.round(modalData.comparison.similarity_ratio * 5)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="mt-4 text-left">
              <h3 className="font-semibold">Base Audio</h3>
              <p>Pinyin: {modalData.base_audio.pinyin}</p>
              <p>Transcription: {modalData.base_audio.transcription}</p>
            </div>
            <div className="mt-4 text-left">
              <h3 className="font-semibold">Uploaded Audio</h3>
              <p>Pinyin: {modalData.uploaded_audio.pinyin}</p>
              <p>Transcription: {modalData.uploaded_audio.transcription}</p>
            </div>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Modified processing indicator */}
      {isProcessing && (
        <div className="fixed bottom-4 right-4 flex items-center p-2 bg-blue-900 bg-opacity-80 rounded-md">
          <Loader className="animate-spin h-6 w-6 text-white" />
          <span className="ml-2 text-white">Processing...</span>
        </div>
      )}
      {/* Global style block to hide scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

function Mic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

