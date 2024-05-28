import { prisma } from "..";
import Stripe from "stripe";

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        price: true,
      },
    });

    return products;
  } catch (error) {
    console.error(error);
  }

  return null;
};

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
      include: {
        price: true,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export type ProductItemIncluded = Awaited<ReturnType<typeof upsertProduct>>;

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
