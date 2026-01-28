// frontend/src/context/TaskContext.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import axios from "axios"
import { useSession } from "@/lib/auth-client"

interface Task {
  id: number
  title: string
  description: string | null
  status: string
  priority?: string
}

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  refreshTasks: () => Promise<void>
  addTask: (title: string) => Promise<void>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  const API_URL = "http://127.0.0.1:8000/api/v1"

  // Helper function to get the token from session
  const getToken = (): string | null => {
    // First try from useSession hook
    if (session?.session?.token) {
      return session.session.token
    }
    
    // Fallback: Try to get from localStorage directly
    try {
      const storedSession = localStorage.getItem('better-auth-session')
      if (storedSession) {
        const parsed = JSON.parse(storedSession)
        return parsed.token || null
      }
    } catch (e) {
      console.error('Failed to parse stored session:', e)
    }
    
    return null
  }

  const refreshTasks = useCallback(async () => {
    const token = getToken()
    
    console.log('🔄 Refreshing tasks...')
    console.log('Token found:', !!token)
    
    if (!token) {
      console.log('❌ No session token')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('✅ Tasks fetched:', response.data)
      setTasks(response.data)
    } catch (error: any) {
      console.error("[TaskContext] Failed to fetch tasks:", error)
      console.error("Error response:", error.response?.data)
    } finally {
      setLoading(false)
    }
  }, [session])

  const addTask = useCallback(
    async (title: string) => {
      const token = getToken()
      
      console.log('➕ Adding task:', title)
      console.log('Token found:', !!token)
      
      if (!token) {
        console.error('❌ No session token for adding task')
        return
      }

      try {
        const response = await axios.post(
          `${API_URL}/tasks`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log('✅ Task created:', response.data)
        setTasks((prev) => [...prev, response.data])
      } catch (error: any) {
        console.error("[TaskContext] Failed to add task:", error)
        console.error("Error response:", error.response?.data)
      }
    },
    [session]
  )

  useEffect(() => {
    const token = getToken()
    if (token) {
      refreshTasks()
    }
  }, [session, refreshTasks])

  return (
    <TaskContext.Provider value={{ tasks, loading, refreshTasks, addTask, setTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}