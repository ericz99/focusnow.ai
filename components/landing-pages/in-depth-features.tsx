"uyse client";

import React from "react";
import { FeatureSection } from "./feature-section";

export function InDepthFeatures() {
  return (
    <div className="mx-auto max-w-7xl mt-16 px-4 sm:px-6 lg:px-8 pb-32 text-center relative">
      <FeatureSection
        title="Document"
        heading="Easily upload your document securely under a few second"
        description="You can upload both Resume & Cover Letter freely."
        buttonText="Get Started"
        videoName="doc-demo1.mp4"
      />

      <FeatureSection
        title="Job"
        heading="Take a few type and clicks to create a job application"
        description="Allow the AI to understand the job context."
        buttonText="Get Started"
        videoName="job-demo.mp4"
        direction="right"
      />

      <FeatureSection
        title="Interview"
        heading="Easy way to create an interview session"
        description="After creating the interview session, you are ready to launch copilot."
        buttonText="Get Started"
        videoName="interview-demo.mp4"
      />

      <FeatureSection
        title="AI Copilot"
        heading="Power your interview session with our AI Interview Copilot"
        description="Allow our copilot to assist you in your interview's journey"
        buttonText="Get Started"
        videoName="interview-demo.mp4"
        direction="right"
      />
    </div>
  );
}
