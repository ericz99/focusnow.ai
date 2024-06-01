import React from "react";

import { Navbar } from "@/components/landing-pages/navbar";
import { HeroWithVideo } from "@/components/landing-pages/hero-with-video";
import { Features } from "@/components/landing-pages/features";
import { InDepthFeatures } from "@/components/landing-pages/in-depth-features";
import { FAQ } from "@/components/landing-pages/faq";
import { Footer } from "@/components/landing-pages/footer";
import { PricingCard } from "@/components/landing-pages/pricing-card";
import { getProducts } from "@/prisma/db/product";

export default async function Page() {
  const products = await getProducts();

  // # get only type of recurring
  const recurringPlans = products
    ?.filter((p) => p.price?.type == "recurring")
    .reverse();

  return (
    <div className="flex flex-col relative h-full w-full max-w-7xl mx-auto">
      <Navbar />
      <HeroWithVideo />
      <InDepthFeatures />

      <div className="flex flex-col gap-4 relative w-full max-w-7xl mx-auto px-4 py-14 md:px-8">
        <div className="mx-auto max-w-5xl text-center mb-8">
          <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
            Pricing
          </h4>
          <h2 className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            Simple pricing for everyone.
          </h2>
          <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
            Choose an <strong>affordable plan</strong> packed with advanced
            features to enhance your interview process, improve candidate
            assessment, and streamline hiring decisions.
          </p>
        </div>

        <div className="mx-auto grid w-full justify-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {recurringPlans?.map((p) => (
            <PricingCard
              key={p!.id}
              name={p!.name}
              description={p!.description!}
              unitAmount={p!.price!.unitAmount}
              isBestPlan={p!.name == "Pro Plan"}
              featureListItems={
                JSON.parse(JSON.stringify(p!.metadata)).features as string[]
              }
            />
          ))}
        </div>
      </div>

      <FAQ />
      <Footer />
    </div>
  );
}
