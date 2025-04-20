"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mic, Play, Square } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function PracticePage() {
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudio(audioUrl)
        audioChunksRef.current = []
      }

      audioChunksRef.current = []
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access your microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio)
      audio.play()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-4 flex items-center">
        <Button variant="ghost" className="text-white p-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-white ml-4">Practice Speaking</h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Record your voice</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <p className="text-center text-gray-500">Record yourself speaking and get feedback on your pronunciation</p>

            <div className="flex justify-center">
              {isRecording ? (
                <Button size="icon" variant="destructive" className="rounded-full h-16 w-16" onClick={stopRecording}>
                  <Square className="h-8 w-8" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  className="rounded-full h-16 w-16 bg-blue-600 hover:bg-blue-700"
                  onClick={startRecording}
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="w-full h-8 bg-gray-200 rounded-md overflow-hidden">
                <div className="h-full bg-red-500 animate-pulse flex items-center">
                  <div className="w-full h-4 flex items-center">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-full w-1 bg-red-300 mx-0.5"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {recordedAudio && !isRecording && (
              <div className="w-full space-y-4">
                <div className="flex items-center space-x-2">
                  <Button size="icon" onClick={playRecording}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-full bg-gray-200 rounded-md overflow-hidden">
                    <div className="h-full bg-green-500 w-full flex items-center">
                      <div className="w-full h-4 flex items-center">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-full w-1 bg-green-300 mx-0.5"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-md">
                  <h3 className="font-bold mb-2">Feedback:</h3>
                  <p>Your pronunciation is good! Try to emphasize the "r" sound a bit more.</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded mr-2 mb-2">
                      Pronunciation: 85%
                    </span>
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded mr-2 mb-2">
                      Fluency: 70%
                    </span>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded mb-2">Accuracy: 90%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

