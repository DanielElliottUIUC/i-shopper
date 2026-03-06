export type Product = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  retailerUrl: string;
  rating: number;
  reviewCount: number;
  source: "amazon" | "google";
  rawAttributes: Record<string, string>;
};

export type RankedProduct = {
  productId: string;
  score: number;
  reason: string;
  matchedAttributes: string[];
};

export type RerankerOutput = {
  nullProduct: boolean;
  results: RankedProduct[];
};
