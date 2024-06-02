export const PRICES = {
  free_plan: "price_1PLUOpJ58A1yplC4LSZZOMKX",
  standard_plan: "price_1PMfm9J58A1yplC4W0p3KmhA",
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
    metadata: {
      features: [
        "$25 worth of credit",
        "Advanced AI Model",
        "5 Document Upload",
        "5 Job Application Creator",
        "1 Session Creation",
        "Limited features...",
      ],
    },
    price: {
      id: "price_1PLUOpJ58A1yplC4LSZZOMKX",
      active: true,
      unitAmount: 0,
      currency: "USD",
    },
  },
  {
    name: "Standard Plan",
    id: "prod_QD5ymJCLk3SKo8",
    image: "https://placehold.co/600x400",
    description:
      "A standard plan is ideal for candidate that need to prepare up to 4 interview session.",
    active: true,
    metadata: {
      features: [
        "100 credit / month",
        "Advanced AI Model",
        "Unlimited Document Upload",
        "Unlimited Job Application Creator",
        "Up to only 4 interview session (25 credit)",
        "More features...",
      ],
    },
    price: {
      id: "price_1PMfm9J58A1yplC4W0p3KmhA",
      active: true,
      unitAmount: 99.99,
      currency: "USD",
    },
  },
  {
    name: "Pro Plan",
    id: "prod_Q7Ndc6gfkUJxVH",
    image: "https://placehold.co/600x400",
    description:
      "A pro plan is ideal for candidate that need to prepare up to 8 interview session.",
    active: true,
    metadata: {
      features: [
        "250 credit / 3 month",
        "Advanced AI Model",
        "Unlimited Document Upload",
        "Unlimited Job Application Creator",
        "Up to only 8 interview session (25 credit)",
        "More features...",
      ],
    },
    price: {
      id: "price_1PMfsJJ58A1yplC455mGynTM",
      intervalCount: 3,
      active: true,
      unitAmount: 199.99,
      currency: "USD",
    },
  },
  {
    name: "FAANG Plan",
    id: "prod_Q7KASBVQG5Qgv8",
    image: "https://placehold.co/600x400",
    description:
      "An FAANG plan comes with 500 credit per 6 month, and can be used for up to 20 interview session.",
    active: true,
    metadata: {
      features: [
        "500 credit / 6 month",
        "Advanced AI Model",
        "Unlimited Document Upload",
        "Unlimited Job Application Creator",
        "Up to only 12 interview session (25 credit)",
        "More features...",
      ],
    },
    price: {
      id: "price_1PMfrnJ58A1yplC4STi1zYzW",
      intervalCount: 6,
      active: true,
      unitAmount: 299.99,
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
