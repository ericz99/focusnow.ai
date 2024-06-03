/* eslint-disable react/no-unescaped-entities */
"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function cookieConsentGiven(): string {
  if (!localStorage.getItem("cookie_consent")) {
    return "undecided";
  }

  return localStorage.getItem("cookie_consent")!;
}

export function CookieBanner() {
  const [consentGiven, setConsentGiven] = useState("");
  const posthog = usePostHog();

  useEffect(() => {
    // We want this to only run once the client loads
    // or else it causes a hydration error
    setConsentGiven(cookieConsentGiven());
  }, []);

  useEffect(() => {
    if (consentGiven !== "") {
      posthog.set_config({
        persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
      });
    }
  }, [consentGiven]);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
  };
  return (
    consentGiven === "undecided" && (
      <div className="w-full max-w-sm absolute bottom-10 right-10 border border-solid bg-slate-700 p-4 rounded-lg">
        <p className="text-sm text-white">
          Our website uses cookies to enhance your browsing experience,
          personalize content, and analyze our traffic. By clicking "Accept All
          Cookies," you consent to our use of cookies. You can manage your
          preferences by clicking "Cookie Settings."
        </p>

        <div className="flex gap-4 relative w-full mt-4">
          <Button
            type="button"
            variant={"default"}
            onClick={handleAcceptCookies}
            className="w-full"
          >
            Accept cookies
          </Button>
          <Button
            type="button"
            variant={"default"}
            onClick={handleDeclineCookies}
            className="w-full"
          >
            Decline cookies
          </Button>
        </div>
      </div>
    )
  );
}
