import { useState } from "react";

interface UseModalResult {
  visible: boolean;
  showModal: () => void;
  hideModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState = false): UseModalResult => {
  const [visible, setVisible] = useState(initialState);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const toggleModal = () => setVisible((prev) => !prev);

  return { visible, showModal, hideModal, toggleModal };
};
