import React from "react";

type ActionButtonProps = {
  onPress: () => void;
  title: string;
  isDarkMode: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  title,
  isDarkMode,
}) => {
  return (
    <button
      className="py-6 rounded-md mb-10 border-2 border-[#FBB03B] w-full"
      onClick={onPress}
    >
      <span
        className={`${
          isDarkMode ? "text-white" : "text-black"
        } text-center font-medium`}
      >
        {title}
      </span>
    </button>
  );
};

export default ActionButton;
