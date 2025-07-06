// src/components/ProtectedRoute.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuth } from '@/lib/isAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")
        const isAuthenticated = await isAuth()
        if (!isAuthenticated) {
          router.push('/users/login')
        }
      } catch (error) {
        router.push('/users/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) return <div>Loading...</div>

  return <>{children}</>
}