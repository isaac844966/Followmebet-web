import React from "react";

type AmountInputProps = {
  customAmount: string;
  onChangeAmount: (text: string) => void;
  isDarkMode: boolean;
  minAmount?: number;
};

const AmountInput: React.FC<AmountInputProps> = ({
  customAmount,
  onChangeAmount,
  isDarkMode,
  minAmount = 100,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const inputBg = isDarkMode ? "bg-[#1A1942]" : "bg-gray-100";
  const inputText = isDarkMode ? "text-white" : "text-black";
  const errorTextColor = "text-red-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeAmount(e.target.value);
  };

  const isAmountValid = !customAmount || Number(customAmount) >= minAmount;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <p className={`${textColor} text-base font-medium`}>Enter amount</p>
        <p className={`${textColor} text-sm opacity-70`}>Min: {minAmount}</p>
      </div>

      <input
        className={`${inputBg} ${inputText} p-4 py-6 rounded-md border-[0.5px] ${
          !isAmountValid ? "border-red-500" : "border-[#5554]"
        } mb-2 w-full`}
        placeholder={`Enter amount (min ${minAmount})`}
        type="number"
        value={customAmount}
        onChange={handleChange}
        style={{
          color: isDarkMode ? "white" : "black",
        }}
      />

      {!isAmountValid && (
        <p className={`${errorTextColor} text-sm`}>
          Amount must be at least {minAmount}
        </p>
      )}
    </div>
  );
};

export default AmountInput;
