"use client";

import type React from "react";

import { useEffect, useRef } from "react";

interface SuccessIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const SuccessIcon: React.FC<SuccessIconProps> = ({
  size = 80,
  color = "#FFA726",
  strokeWidth = 6,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate the circle
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;

      // Force a reflow
      circleRef.current.getBoundingClientRect();

      // Animate
      circleRef.current.style.transition = "stroke-dashoffset 800ms ease-out";
      circleRef.current.style.strokeDashoffset = "0";
    }

    // Animate the checkmark with delay
    if (checkRef.current) {
      checkRef.current.style.strokeDasharray = "48";
      checkRef.current.style.strokeDashoffset = "48";

      // Force a reflow
      checkRef.current.getBoundingClientRect();

      // Animate with delay
      setTimeout(() => {
        if (checkRef.current) {
          checkRef.current.style.transition =
            "stroke-dashoffset 500ms cubic-bezier(0.215, 0.61, 0.355, 1)";
          checkRef.current.style.strokeDashoffset = "0";
        }
      }, 400);
    }
  }, [circumference]);

  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle
          ref={circleRef}
          cx={40}
          cy={40}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <path
          ref={checkRef}
          d="M24 42 L36 54 L58 30"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default SuccessIcon;
