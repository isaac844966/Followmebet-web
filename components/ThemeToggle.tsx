"use client"
import { useTheme } from "@/lib/contexts/ThemeContext"

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-dark-accent-100" : "bg-light-accent-100"}`}
    >
      <span className={`font-medium ${isDarkMode ? "text-white" : "text-light-text"}`}>
        {isDarkMode ? "Switch to Light" : "Switch to Dark"}
      </span>
    </button>
  )
}

export default ThemeToggle
