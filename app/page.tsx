"use client"
import { useTheme } from "@/lib/contexts/ThemeContext"
import Link from "next/link"
import Image from "next/image"
import CustomButton from "@/components/CustomButton"

export default function Home() {
  const { isDarkMode } = useTheme()

  return (
    <div
      className={`flex-1 h-screen px-10 pb-8 ${isDarkMode ? "dark" : ""}`}
      style={{
        backgroundImage: `url(${isDarkMode ? "/images/home-bg-dark.png" : "/images/home-bg-light.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col min-h-screen pb-8">
        <div className="items-center mt-20 text-center">
          <h1 className={`text-6xl text-center font-bold ${isDarkMode ? "text-white" : "text-light-text"}`}>
            Bet With
          </h1>
          <h1 className="text-6xl text-center text-primary-400 font-bold">Friends</h1>
        </div>

        <div className="flex-1"></div>

        <div className="items-center justify-center mb-16 flex">
          <Image src="/images/icon.png" alt="App Icon" width={200} height={200} className="object-contain" />
        </div>

        {/* Buttons side by side */}
        <div className="w-full flex justify-between space-x-4 gap-2">
          <Link href="/signup" className="flex-1">
            <CustomButton
              title="Sign Up"
              size="lg"
              className="w-full bg-dark-accent-100 py-4 rounded-lg items-center"
            />
          </Link>

          <Link href="/login" className="flex-1">
            <CustomButton
              title="Login"
              variant="outline"
              size="lg"
              className={`w-full border py-4  items-center ${
                isDarkMode ? "border-white" : "border-light-text bg-white"
              }`}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
