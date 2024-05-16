export const SEED_PLANS = [
  {
    name: "Business Plan",
    id: "prod_Q7KASBVQG5Qgv8",
    image: "https://placehold.co/600x400",
    active: true,
    price: {
      id: "price_1PH5WLJ58A1yplC4UUm9QSZB",
      active: true,
      unitAmount: 199.99,
      currency: "USD",
    },
  },
  {
    name: "Pro Plan",
    id: "prod_Q7Ndc6gfkUJxVH",
    image: "https://placehold.co/600x400",
    active: true,
    price: {
      id: "price_1PH8sCJ58A1yplC4ySftkaAL",
      active: true,
      unitAmount: 99.99,
      currency: "USD",
    },
  },
];

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro Plan",
    slug: "pro",
    price: {
      amount: 19,
      priceIds: {
        test: "price_1P04iwJ58A1yplC4xuLguYds",
        production: "",
      },
    },
  },

  {
    name: "Business Plan",
    slug: "business",
    price: {
      amount: 29.99,
      priceIds: {
        test: "price_1PH5WLJ58A1yplC4UUm9QSZB",
        production: "",
      },
    },
  },
];
