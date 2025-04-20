"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import logo from "../assets/logo.png"
import { useUserStore } from "@/store/User/user"

export default function WelcomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [showButtons, setShowButtons] = useState(false)
  const { user } = useUserStore()

  useEffect(() => {
    if (user) {
      navigate("/home") // Redirect to home if user is logged in
      return
    }

    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome")
    if (hasSeenWelcome) {
      setLoading(false)
      setShowButtons(true)
      return
    }

    // Simulate loading time for splash screen
    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setShowButtons(true), 500) // Delay buttons appearance
      sessionStorage.setItem("hasSeenWelcome", "true") // Mark welcome as seen for the session
    }, 2000)

    return () => clearTimeout(timer)
  }, [user, navigate])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
        <div className="w-32 h-32 mb-4 animate-bounce">
          <img src={logo} alt="BiLinGo Logo" className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-16">BILINGO</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className={`w-32 h-32 mb-4 transition-transform duration-500 ${showButtons ? "scale-100" : "scale-0"}`}>
        <img src={logo} alt="BiLinGo Logo" className="w-full h-full" />
      </div>
      <h1 className={`text-4xl font-bold text-white mb-16 transition-opacity duration-500 ${showButtons ? "opacity-100" : "opacity-0"}`}>
        BILINGO
      </h1>

      <div className={`w-full max-w-xs flex flex-col gap-4 transition-opacity duration-500 ${showButtons ? "opacity-100" : "opacity-0"}`}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white py-6" onClick={() => navigate("/login")}>
          Log into Existing Account
        </Button>

        <div className="text-center text-white">OR</div>

        <Button
          variant="outline"
          className="bg-white hover:bg-gray-100 text-black py-6"
          onClick={() => navigate("/register")}
        >
          Create New Account
        </Button>
      </div>
    </div>
  )
}

