import { useState } from "react";

// Define the modal types
export type StatusType = "success" | "error" | "warning" | "info";

// Modal state structure
export interface StatusModalState {
  visible: boolean;
  title: string;
  message: string;
  type: StatusType;
  buttonText: string;
}

// Export the result type so it can be used in other files
export interface UseStatusModalResult {
  modalState: StatusModalState;
  showSuccessModal: (
    message: string,
    title?: string,
    buttonText?: string
  ) => void;
  showErrorModal: (
    message: string,
    title?: string,
    buttonText?: string
  ) => void;
  showWarningModal: (
    message: string,
    title?: string,
    buttonText?: string
  ) => void;
  showInfoModal: (message: string, title?: string, buttonText?: string) => void;
  hideModal: () => void;
}

export const useStatusModal = (): UseStatusModalResult => {
  const [modalState, setModalState] = useState<StatusModalState>({
    visible: false,
    title: "",
    message: "",
    type: "success",
    buttonText: "OK",
  });

  const showModal = (
    type: StatusType,
    message: string,
    title: string = "",
    buttonText: string = "OK"
  ) => {
    setModalState({
      visible: true,
      type,
      message,
      title,
      buttonText,
    });
  };

  const showSuccessModal = (
    message: string,
    title: string = "Success",
    buttonText: string = "OK"
  ) => {
    showModal("success", message, title, buttonText);
  };

  const showErrorModal = (
    message: string,
    title: string = "Error",
    buttonText: string = "OK"
  ) => {
    showModal("error", message, title, buttonText);
  };

  const showWarningModal = (
    message: string,
    title: string = "Warning",
    buttonText: string = "OK"
  ) => {
    showModal("warning", message, title, buttonText);
  };

  const showInfoModal = (
    message: string,
    title: string = "Information",
    buttonText: string = "OK"
  ) => {
    showModal("info", message, title, buttonText);
  };

  const hideModal = () => {
    setModalState((prev) => ({ ...prev, visible: false }));
  };

  return {
    modalState,
    showSuccessModal,
    showErrorModal,
    showWarningModal,
    showInfoModal,
    hideModal,
  };
};
