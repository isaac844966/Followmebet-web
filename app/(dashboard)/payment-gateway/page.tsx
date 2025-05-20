"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUserProfile } from "@/lib/services/authService";

const PaymentGateway = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setTimeout(() => router.replace("/wallet"), 2000);
      }
    };

    const checkIframeUrl = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const currentUrl = iframe.contentWindow?.location.href;

        if (
          currentUrl &&
          currentUrl.includes("payment-gateway/redirect") 
        ) {
          console.log("Redirect URL detected in iframe.");
          clearInterval(interval); 
          handlePaymentResponse();
        }
      } catch (err) {
        console.log("Cross-origin: cannot read iframe URL.");
      }
    };

    const interval = setInterval(checkIframeUrl, 1000);

    return () => clearInterval(interval);
  }, [url, router]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div>
   

      {url && (
        <iframe
          ref={iframeRef}
          src={url}
          onLoad={handleIframeLoad}
          className="w-full h-[100vh] border-0"
          allow="payment"
        />
      )}

    </div>
  );
};

export default PaymentGateway;
