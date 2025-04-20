"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { register } from "@/api/auth";
import { useUserStore } from "@/store/User/user";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const primaryLanguage = "chinese"; // Default value for primaryLanguage

  const {setUser} = useUserStore();

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await register(email, fullName, password, primaryLanguage);

      if (response.success) {
        navigate("/courses");
        setUser(response.user??null);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-4">
        <Button
          variant="ghost"
          className="text-white p-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg p-8 m-4">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-2xl font-bold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="primaryLanguage" className="text-2xl font-bold">
                Primary Language
              </Label>
              <select
                id="primaryLanguage"
                className="border rounded px-3 py-2"
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                required
              >
                <option value="chinese">Chinese</option>
                <option value="english">English</option>
                {/* <option value="urdu">Urdu</option> */}
              {/* </select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-2xl font-bold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-2xl font-bold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-2xl font-bold">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
            >
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
