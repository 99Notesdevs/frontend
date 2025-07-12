'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuth } from '@/lib/isAuth'
import Cookies from 'js-cookie'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check token on every check, not just on mount
        const currentToken = Cookies.get('token')
        if (!currentToken) {
          throw new Error('No token found')
        }

        console.log("Checking authentication...")
        const auth = await isAuth()
        const isAuthenticated = auth?.isAuthenticated ?? false
        
        console.log("Authenticated:", isAuthenticated)
        if (!isAuthenticated) {
          console.log("Not authenticated")
          throw new Error('Not authenticated')
        }
      } catch (error) {
        console.log("Authentication check failed:", error)
        // Clear any invalid token
        Cookies.remove('token')
        router.push('/users/login')
        return
      } finally {
        setLoading(false)
      }
    }

    // Initial check
    checkAuthStatus()

    // Set up an interval to check auth status periodically
    const intervalId = setInterval(checkAuthStatus, 30000) // Check every 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}