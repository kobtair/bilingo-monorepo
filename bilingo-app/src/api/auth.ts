import axios from "axios"
import { UserState } from "@/store/User/user"

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserState["user"]
}

const api = import.meta.env.VITE_BACKEND_API
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await  axios.post<AuthResponse>(`${api}/login`, {
    email, password
  })

  const user = response.data;

  if (user && user.user) {
    return {
      success: true,
      user: user.user,
    }
  }

  return {
    success: false,
    message: "Invalid email or password",
  }
}

export async function register(email: string, name: string, password: string, primaryLanguage: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${api}/register`, {
      email, name, password, primaryLanguage
    })

    const user = response.data;

    if (user && user.user) {
      return {
        success: true,
        user: user.user,
      }
    }
    if (user && user.message) {
      return {
        success: false,
        message: user.message,
      }
    }

    return {
      success: false,
      message: "Registration failed",
    }
  } catch (error: unknown) {
    console.error("Registration error:", error)
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data || "An error occurred during registration",  
      }
    }
    return {
      success: false,
      message: "An unexpected error occurred during registration",  
    }
  }
}

export async function resetPassword(email: string){
  try {
    const response = await axios.post<AuthResponse>(`${api}/reset-password`, {
      email
    })
    const user = response.data;
    if (user && user.user) {
      return {
        success: true,
      }
    } }
  catch (error) {
    console.error("Reset password error:", error)
    return {
      success: false,
      message: "An error occurred during password reset",
    }
  }
}

export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const response = await axios.get<AuthResponse>(`${api}/auth/google`)
    const user = response.data

    if (user && user.user) {
      return {
        success: true,
        user: user.user,
      }
    }

    return {
      success: false,
      message: "Google sign-in failed",
    }
  } catch (error) {
    console.error("Google sign-in error:", error)
    return {
      success: false,
      message: "An error occurred during Google sign-in",
    }
  }
}

