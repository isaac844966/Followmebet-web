"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const THEME_STORAGE_KEY = "app_theme"

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  isLoading: true,
})

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme === "light") {
          setIsDarkMode(false)
        }
      } catch (error) {
        console.error("Failed to load theme:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [])

  useEffect(() => {
    const saveTheme = () => {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light")

        // Update document class for dark mode
        if (isDarkMode) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } catch (error) {
        console.error("Failed to save theme:", error)
      }
    }

    if (!isLoading) {
      saveTheme()
    }
  }, [isDarkMode, isLoading])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isLoading }}>
      {!isLoading && children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
