"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { login } from "../api/auth"
import { useUserStore } from "@/store/User/user"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const {setUser} = useUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await login(email, password)

      if (response.success) {
        setUser(response.user??null)
        navigate("/courses")
      } else {
        setError(response.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
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
          <h2 className="text-2xl font-bold mb-6">Email</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Password</h2>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
              Sign In
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" className="text-blue-600" onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

