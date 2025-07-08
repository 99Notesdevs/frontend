"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

// This component ensures the dark class is properly set on the HTML element
function ThemeWatcher() {
  const { theme } = useTheme()
  
  useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }, [theme])
  
  return null
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider> & {
  enableSystem?: boolean
  defaultTheme?: string
  forcedTheme?: string
}) {
  const pathname = usePathname()
  const isNoNavbar = pathname?.startsWith('/(no-navbar)') ?? false
  
  // Don't apply theme if it's a no-navbar route
  if (isNoNavbar) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      <ThemeWatcher />
      {children}
    </NextThemesProvider>
  )
}