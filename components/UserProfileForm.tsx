"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { fetchStates } from "@/lib/services/stateServices";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";
import CustomButton from "./CustomButton";
import { Info } from "lucide-react";
import Link from "next/link";

interface State {
  name: string;
  id: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  country: string;
  state: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  email?: string;
  country?: string;
  state?: string;
  general?: string;
}

interface Props {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  errors: Errors;
  editableNames?: boolean;
  showInfoBox?: boolean;
}

const UserProfileForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading,
  errors,
  editableNames = true,
  showInfoBox = false,
}) => {
  const { isDarkMode } = useTheme();
  const [states, setStates] = useState<State[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await fetchStates();
        if (response.data?.items) {
          setStates(response.data.items);
        } else {
          setApiError("Failed to load states: unexpected data format.");
        }
      } catch (error) {
        setApiError("Failed to load states.");
      }
    };

    getStates();
  }, []);

  return (
    <div className="flex-1 px-4">
      {showInfoBox && (
        <div className="">
          <h2
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } mb-4 text-xl xs:text-lg font-bold`}
          >
            Welcome Player
          </h2>
          <p
            className={`${
              isDarkMode ? "text-[#A0A3AC]" : "text-[#A0A3AC]"
            } mb-8 xs:mb-4 text-md font-medium`}
          >
            setup your account
          </p>
          <div className="bg-primary-1600 rounded-lg p-4 mb-6 flex gap-2 border-2 border-primary-1500">
            <Info
              size={20}
              color="#38D4FD"
              className="mr-2 mt-1 flex-shrink-0"
            />

            <p className="text-primary-1500 flex-1 text-sm xs:text-xs">
              Your first name and last name must match the account holder name
              of your bank account in order to process a withdrawal.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-4 mb-2 mt-4">
        <div className="flex-1">
          <CustomInput
            label="First Name"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            disabled={!editableNames}
            error={errors.firstName}
          />
        </div>
        <div className="flex-1">
          <CustomInput
            label="Last Name"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            disabled={!editableNames}
            error={errors.lastName}
          />
        </div>
      </div>

      <CustomInput
        label="Nickname"
        placeholder="Nickname"
        value={formData.nickname}
        onChange={(e) => onChange("nickname", e.target.value)}
        error={errors.nickname}
      />

      <CustomInput
        label="Email Address"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => onChange("email", e.target.value)}
        type="email"
        autoCapitalize="none"
        error={errors.email}
      />

      <CustomInput
        label="Country"
        placeholder="Nigeria"
        value={formData.country}
        disabled={true}
        error={errors.country}
      />

      <div className="mb-4">
        <CustomSelect
          label="Select State"
          options={states.map((state) => ({
            label: state.name,
            value: state.id,
          }))}
          value={formData.state}
          onChange={(value) => onChange("state", value)}
          error={errors.state}
          searchable={true}
        />
      </div>

      {showInfoBox && (
        <div className="mb-6 mt-2">
          <p className="text-gray-400 text-sm">
            By continuing you are 18+ and agree to our{" "}
            <Link
              href="https://followmebet.com.ng/terms"
              className="text-primary-400 underline"
            >
              terms and conditions
            </Link>{" "}
            as well as our{" "}
            <Link
              href="https://followmebet.com/privacy"
              className="text-primary-400 underline"
            >
              privacy policy
            </Link>
          </p>
        </div>
      )}

      <CustomButton
        title="Finish"
        size="lg"
        loading={loading}
        onClick={onSubmit}
        buttonStyle={{ marginBottom: 24 }}
        className="w-full"
      />
    </div>
  );
};

export default UserProfileForm;
