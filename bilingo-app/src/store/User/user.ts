import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserState = {
  user: {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    level: string;
    progress: number;
    lastActive: string;
    joinDate: string;
    points: number;
    status: string;
  } | null;
  setUser: (user: UserState['user']) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserState['user']) => set({ user }),
      logout: () => set({ user: null })
    }),
    {
      name: 'user-storage', 
      storage: createJSONStorage(() => sessionStorage) 
    }
  )
)

