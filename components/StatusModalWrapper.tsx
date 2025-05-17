"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface StatusModalWrapperProps {
  modalState?: {
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    buttonText?: string;
  };
  visible?: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "success" | "error" | "warning" | "info";
  buttonText?: string;
}

const StatusModalWrapper: React.FC<StatusModalWrapperProps> = (props) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Support both legacy props and new modalState object
  const visible = props.modalState?.visible ?? props.visible ?? false;
  const title = props.modalState?.title ?? props.title ?? "";
  const message = props.modalState?.message ?? props.message ?? "";
  const type = props.modalState?.type ?? props.type ?? "info";
  const buttonText = props.modalState?.buttonText ?? props.buttonText ?? "OK";

  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);

  const handleClose = () => {
    setIsOpen(false);
    props.onClose();
  };

  const getIcon = () => {
    const iconSize = 48;
    const iconProps = { size: iconSize, className: "mx-auto mb-4" };

    switch (type) {
      case "success":
        return (
          <CheckCircle {...iconProps} className="text-green-500 mx-auto mb-4" />
        );
      case "error":
        return (
          <AlertCircle {...iconProps} className="text-red-500 mx-auto mb-4" />
        );
      case "warning":
        return (
          <AlertTriangle
            {...iconProps}
            className="text-yellow-500 mx-auto mb-4"
          />
        );
      case "info":
        return <Info {...iconProps} className="text-blue-500 mx-auto mb-4" />;
      default:
        return null;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-black";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={isDarkMode ? "bg-[#2E3192] text-white" : "bg-white"}
      >
        <div className="flex flex-col items-center pt-6">
          {getIcon()}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-6">{message}</p>
          </div>
          <DialogFooter className="w-full">
            <Button
              className={`w-full py-6 ${getButtonColor()}`}
              onClick={handleClose}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModalWrapper;
