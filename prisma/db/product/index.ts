import { prisma } from "..";
import Stripe from "stripe";

export const upsertProduct = async (product: Stripe.Product) => {
  try {
    const data = await prisma.product.create({
      data: {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description ?? null,
        image: product.images?.[0] ?? null,
        metadata: product.metadata,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const deleteProduct = async (data: Stripe.Product) => {
  try {
    await prisma.product.delete({
      where: {
        id: data.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
