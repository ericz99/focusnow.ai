import React from "react";

import { Navbar } from "@/components/landing-pages/navbar";
import { HeroWithVideo } from "@/components/landing-pages/hero-with-video";
import { Features } from "@/components/landing-pages/features";
import { FAQ } from "@/components/landing-pages/faq";
import { Footer } from "@/components/landing-pages/footer";

export default function Page() {
  return (
    <div className="flex flex-col relative h-full w-full max-w-7xl mx-auto">
      <Navbar />
      <HeroWithVideo />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
}
