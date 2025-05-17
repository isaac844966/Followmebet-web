"use client";

import type React from "react";

import { useState } from "react";
import FaqItem from "./FaqItem";

interface FaqListProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
}

const FaqList: React.FC<FaqListProps> = ({ faqs, className }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  return (
    <div className={`space-y-4 pb-6 ${className || ""}`}>
      {faqs.map((faq, index) => (
        <FaqItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isExpanded={expandedId === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default FaqList;
