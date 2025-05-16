"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "@/lib/contexts/ThemeContext"
import CustomInput from "./CustomInput"

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  countryCode?: string
  containerStyle?: React.CSSProperties
  onChangeText?: (text: string) => void
  value?: string
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label = "Phone Number",
  error,
  countryCode = "+234",
  containerStyle,
  onChangeText,
  value,
  ...props
}) => {
  const { isDarkMode } = useTheme()
  const [inputValue, setInputValue] = useState(value || "")

  // Update input value when the prop value changes (from outside)
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  // Handle text input changes directly
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputValue(text)

    // Pass the raw input to parent component
    if (onChangeText) {
      onChangeText(text)
    }
  }

  return (
    <CustomInput
      label={label}
      type="tel"
      placeholder="Phone Number"
      value={inputValue}
      onChange={handleChangeText}
      error={error}
      leftComponent={
        <span
          className="text-lg font-bold"
          style={{
            color: isDarkMode ? "white" : "black",
          }}
        >
          {countryCode}
        </span>
      }
      {...props}
    />
  )
}

export default PhoneInput
