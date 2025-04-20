"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { resetPassword } from "../api/auth"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await resetPassword(email)

      if (response && response.success) {
        setSubmitted(true)
      } else {
        setError(response?.message || "Failed to send reset email")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-4">
        <Button variant="ghost" className="text-white p-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg p-8 m-4">
          {submitted ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Check Your Email</h2>
              <p>We've sent a password reset link to {email}</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-center">{error}</div>}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

