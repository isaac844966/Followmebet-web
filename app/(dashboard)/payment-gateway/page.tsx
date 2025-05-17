"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUserProfile } from "@/lib/services/authService";

const PaymentGateway = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!url) {
      router.replace("/wallet");
      return;
    }

    const handlePaymentResponse = async () => {
      try {
        await fetchUserProfile();
        router.replace("/wallet");
      } catch (error) {
        console.error("Failed to fetch profile after payment:", error);
        setError(
          "Failed to update wallet information. Please check your payment status."
        );
        setTimeout(() => router.replace("/wallet"), 3000);
      }
    };

    // Function to monitor iframe URL changes
    const checkIframeUrl = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        // This will throw a security error if the iframe is cross-origin
        // We need to use a different approach for cross-origin iframes
        const currentUrl = iframe.contentWindow?.location.href;
        console.log("Current iframe URL:", currentUrl);

        if (
          currentUrl &&
          currentUrl.includes("paymentReference=") &&
          currentUrl.includes("followmebet.com.ng")
        ) {
          console.log("Payment reference detected in URL, completing payment");
          handlePaymentResponse();
        }
      } catch (e) {
        // Cross-origin restriction error, we can't access the URL directly
        console.log(
          "Cannot access iframe URL due to cross-origin restrictions"
        );
      }
    };

    // Set interval to check URL (since we can't use onNavigationStateChange like in React Native)
    const interval = setInterval(checkIframeUrl, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [url, router]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load payment gateway. Please try again.");
  };
};

export default PaymentGateway;
