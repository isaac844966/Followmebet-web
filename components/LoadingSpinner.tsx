"use client";

import type React from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  fullPage?: boolean;
  variant?: "spinner" | "dots" | "circular" | "pulse" | "wave";
}

export default function LoadingSpinner({
  size = "md",
  color = "text-primary",
  fullPage = false,
  variant = "circular",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-18 w-18",
  };

  const sizeValues = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const sizeValue = sizeValues[size];
  const strokeWidth = {
    sm: 2,
    md: 3,
    lg: 4,
  };

  const Container = ({ children }: { children: React.ReactNode }) => {
    if (fullPage) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] z-50">
          {children}
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center py-4">{children}</div>
    );
  };

  // Circular spinner - default
  const CircularSpinner = () => (
    <motion.svg
      width={sizeValue}
      height={sizeValue}
      viewBox={`0 0 ${sizeValue} ${sizeValue}`}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      className={cn(color)}
    >
      <circle
        cx={sizeValue / 2}
        cy={sizeValue / 2}
        r={sizeValue / 2 - strokeWidth[size] * 2}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth[size]}
        strokeLinecap="round"
        className="opacity-20"
      />
      <motion.circle
        cx={sizeValue / 2}
        cy={sizeValue / 2}
        r={sizeValue / 2 - strokeWidth[size] * 2}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth[size]}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        strokeDasharray="360"
        strokeDashoffset="0"
      />
    </motion.svg>
  );

  // Dots spinner
  const DotsSpinner = () => {
    const dotSize = {
      sm: "w-1.5 h-1.5",
      md: "w-2 h-2",
      lg: "w-3 h-3",
    };

    return (
      <div className={`flex space-x-1 ${color}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${dotSize[size]} rounded-full bg-current`}
            animate={{
              y: ["0%", "-50%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  };

  // Pulse spinner
  const PulseSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} rounded-full ${color} bg-current opacity-75`}
      animate={{
        scale: [0.5, 1, 0.5],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );

  // Classic spinner with gradient
  const Spinner = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className={`absolute inset-0 rounded-full ${color} bg-current`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
        }}
      />
      <div className="absolute inset-[15%] rounded-full bg-background" />
    </div>
  );

  // Wave spinner
  const WaveSpinner = () => {
    const barCount = 5;
    const barWidth = {
      sm: 2,
      md: 3,
      lg: 4,
    };
    const gap = {
      sm: 2,
      md: 3,
      lg: 4,
    };
    const totalWidth = barWidth[size] * barCount + gap[size] * (barCount - 1);

    return (
      <div
        className={`flex items-end ${color}`}
        style={{
          width: totalWidth,
          height: sizeValue,
        }}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-current rounded-t-sm"
            style={{
              width: barWidth[size],
              marginRight: i < barCount - 1 ? gap[size] : 0,
            }}
            animate={{
              height: ["20%", "100%", "20%"],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return <DotsSpinner />;
      case "pulse":
        return <PulseSpinner />;
      case "spinner":
        return <Spinner />;
      case "wave":
        return <WaveSpinner />;
      case "circular":
      default:
        return <CircularSpinner />;
    }
  };

  return <Container>{renderSpinner()}</Container>;
}
