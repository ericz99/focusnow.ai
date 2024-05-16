// attach a subscription to a existing customer
//

import { prisma } from "@/prisma/db";
import { manageSubscriptionStatusChange } from "@/prisma/db/subscription";
import { SEED_PLANS } from "@/config/stripe";

async function main() {
  for (const plan of SEED_PLANS) {
    const { price, ...rest } = plan;

    const product = await prisma.product.create({
      data: {
        ...rest,
      },
    });

    await prisma.price.create({
      data: {
        ...price,
        trialPeriodDay: 0,
        product: {
          connect: {
            id: product.id,
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
