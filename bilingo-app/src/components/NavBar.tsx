"use client"

import { useUserStore } from "@/store/User/user";
import { NavLink } from "react-router-dom"
import { Home, Book, ChartArea, User } from "lucide-react";
// import { Button } from "./ui/button"
// import { useNavigate } from "react-router-dom"

export default function NavBar() {
  const {user} = useUserStore()
  if (!user) return
  return (
    <div className="w-full bg-blue-800 flex justify-around py-4 fixed bottom-0 left-0">
      <NavLink
        to="/home"
        className={({ isActive }) => `text-white flex flex-col items-center px-3 py-2 transition-all duration-300 ease-in-out ${isActive ? "bg-blue-700 rounded-t-lg scale-110 shadow-lg" : "hover:bg-blue-600"}`}
      >
        <div className="w-6 h-6"><Home /></div>
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink
        to="/courses"
        className={({ isActive }) => `text-white flex flex-col items-center px-3 py-2 transition-all duration-300 ease-in-out ${isActive ? "bg-blue-700 rounded-t-lg scale-110 shadow-lg" : "hover:bg-blue-600"}`}
      >
        <div className="w-6 h-6"><Book /></div>
        <span className="text-xs">Courses</span>
      </NavLink>
      <NavLink
        to="/progress"
        className={({ isActive }) => `text-white flex flex-col items-center px-3 py-2 transition-all duration-300 ease-in-out ${isActive ? "bg-blue-700 rounded-t-lg scale-110 shadow-lg" : "hover:bg-blue-600"}`}
      >
        <div className="w-6 h-6"><ChartArea /></div>
        <span className="text-xs">Progress</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => `text-white flex flex-col items-center px-3 py-2 transition-all duration-300 ease-in-out ${isActive ? "bg-blue-700 rounded-t-lg scale-110 shadow-lg" : "hover:bg-blue-600"}`}
      >
        <div className="w-6 h-6"><User /></div>
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
}

