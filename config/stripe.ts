export const PRICES = {
  free_plan: "price_1PLUOpJ58A1yplC4LSZZOMKX",
  pro_plan: "price_1PH8sCJ58A1yplC4ySftkaAL",
  business_plan: "price_1PH5WLJ58A1yplC4UUm9QSZB",
};

export const SEED_PLANS = [
  {
    name: "Free Plan",
    id: "prod_QBs9nWbq5pP4Z4",
    image: "https://placehold.co/600x400",
    description: "A free plan for curious users that wants to try our product.",
    active: true,
    price: {
      id: "price_1PLUOpJ58A1yplC4LSZZOMKX",
      active: true,
      unitAmount: 0,
      currency: "USD",
    },
  },
  {
    name: "Pro Plan",
    id: "prod_Q7Ndc6gfkUJxVH",
    image: "https://placehold.co/600x400",
    description: "A pro plan for growing businesses.",
    active: true,
    price: {
      id: "price_1PH8sCJ58A1yplC4ySftkaAL",
      active: true,
      unitAmount: 99.99,
      currency: "USD",
    },
  },
  {
    name: "Business Plan",
    id: "prod_Q7KASBVQG5Qgv8",
    image: "https://placehold.co/600x400",
    description:
      "An business plan with advanced features for large organizations.",
    active: true,
    price: {
      id: "price_1PH5WLJ58A1yplC4UUm9QSZB",
      active: true,
      unitAmount: 199.99,
      currency: "USD",
    },
  },
  {
    name: "Credit Only",
    id: "prod_Q7gopzxtqzrSUu",
    image: "https://placehold.co/600x400",
    active: true,
    price: {
      id: "price_1PHRQOJ58A1yplC4mmhC77rJ",
      active: true,
      unitAmount: 1.0,
      currency: "USD",
      type: "one_time" as "one_time" | "recurring",
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
