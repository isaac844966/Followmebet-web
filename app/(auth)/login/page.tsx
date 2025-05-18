"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useAuthStore } from "@/lib/store/authStore";
import { login } from "@/lib/services/authService";
import { handleApiError } from "@/lib/utils/handleApiError";
import PhoneInput from "@/components/PhoneInput";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import StatusModal from "@/components/StatusModal"; // Import the StatusModal component
import Link from "next/link";
import { useStatusModal } from "@/lib/contexts/useStatusModal";

const Login = () => {
  const { isDarkMode } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    password?: string;
  }>({});
  const router = useRouter();
  const { isLoading } = useAuthStore();
  const { modalState, showErrorModal, hideModal } = useStatusModal();

  useEffect(() => {
    const loadPhoneNumber = async () => {
      const storedPhone = localStorage.getItem("phoneMobile");
      if (storedPhone) {
        const cleanedPhone = storedPhone.startsWith("+234")
          ? storedPhone.slice(4)
          : storedPhone;
        setPhoneNumber(cleanedPhone);
      }
    };
    loadPhoneNumber();
  }, []);

  const handleLogin = async () => {
    try {
      setErrors({});
      const mobile = phoneNumber.trim();
      let formattedMobile = mobile;
      if (!mobile.startsWith("+234")) {
        formattedMobile = mobile.startsWith("0")
          ? "+234" + mobile.slice(1)
          : "+234" + mobile;
      }

      await login({ mobile: formattedMobile, password });
      localStorage.setItem("phoneMobile", mobile);

      router.push("/dashboard");
    } catch (error: any) {
      if (error.status === 422 && error.errors) {
        setErrors(error.errors);
      } else if (error.status === 401 && error.errors?.general) {
        showErrorModal(error.errors.general, "Login Error");
      } else {
        handleApiError(error, showErrorModal, "Login failed", "Something went wrong");
      }
      console.log(error);
    }
  };

  return (
    <div className="flex-1 min-h-screen">
      {/* Include the StatusModal component */}
      <StatusModal
        visible={modalState.visible}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        type={modalState.type}
      />

      <div className="flex-1 px-3 pt-28 max-w-md mx-auto">
        <div className="mb-8">
          <h1
            className={`${
              isDarkMode ? "text-white" : "text-black"
            } text-3xl sm:2xl xs:text-xl font-bold mb-4 xs:mb-2`}
          >
            Welcome back!
          </h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-primary-600"} text-md xs:text-sm`}>
            Sign in to your account
          </p>
        </div>

        <PhoneInput
          placeholder="Mobile Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          error={errors.phoneNumber}
          maxLength={10}
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isPassword={true}
          error={errors.password}
        />

        <div className="items-end mb-8 flex">
          <Link
            href="/forgot-password"
            className="text-primary-400 font-medium"
          >
            Forgot Password
          </Link>
        </div>

        <CustomButton
          title="Sign In"
          size="lg"
          loading={isLoading}
          onClick={handleLogin}
          buttonStyle={{ marginBottom: 24 }}
          className="w-full"
        />

        <div className="flex justify-center">
          <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
            Don&apos;t have an account?{" "}
          </p>
          <Link
            href="/signup"
            className="text-dark-accent-100 font-medium ml-1"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
