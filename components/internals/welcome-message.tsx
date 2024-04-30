import React from "react";

const welcomeMessages = [
  "🤖: Welcome aboard Interview Copilot! Get ready to soar through your interview prep journey with our personalized guidance and support.",
  "🤖: Hey there! Welcome to Interview Copilot, where we're here to navigate you through the skies of successful interviews. Let's take off together!",
  "🤖: Welcome to Interview Copilot! Buckle up and enjoy the ride as we help you navigate the turbulence of job interviews with confidence and ease.",
  "🤖: Hello and welcome to Interview Copilot! Prepare for smooth sailing through your interview preparations with our expert guidance by your side.",
  "🤖: Welcome to Interview Copilot! Sit back, relax, and let us be your trusted co-pilots as you navigate the skies of career advancement.",
];

export function WelcomeMessage() {
  const rand = Math.floor(Math.random() * welcomeMessages.length);
  return (
    <div className="bg-white py-4 px-6 relative">
      <p className="text-sm">{welcomeMessages[rand]}</p>
    </div>
  );
}
