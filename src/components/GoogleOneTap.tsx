"use client";
import { useEffect } from "react";
import { env } from "@/config/env";
import { api } from "@/config/api/route";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOneTap() {
  // Handler for Google credential response
  const handleCredentialResponse = async (response: any) => {
    const res = (await api.post(`/user/google`, {
      body: JSON.stringify({ credential: response.credential }),
    })) as { success: boolean };
    if (res.success) {
      window.location.href = window.location.href;
    } else {
      alert("Login failed");
    }
  };

  useEffect(() => {
    // Dynamically load the Google One Tap script if not already loaded
    if (typeof window === "undefined") return;
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleCredentialResponse,
            auto_select: true,
            cancel_on_tap_outside: false,
          });
          window.google.accounts.id.prompt();
        }
      };
      document.body.appendChild(script);
    } else {
      window.google.accounts.id.initialize({
        client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        auto_select: true,
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.prompt();
    }
    // No UI, just the prompt
  }, []);

  return null;
}
