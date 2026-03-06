export type BudgetRange = {
  min: number;
  max: number;
};

export type PastSignal = {
  attribute: string;
  weight: number;
  source: "accepted_product" | "rejected_product" | "feedback";
};

export type AntiPreferences = {
  brands: string[];
  materials: string[];
  formFactors: string[];
};

export type ProfileData = {
  budgetRanges: {
    default: BudgetRange;
    [category: string]: BudgetRange;
  };
  priorityAttributes: string[];
  antiPreferences: AntiPreferences;
  pastSignals: PastSignal[];
};

export type UserProfile = {
  userId: string;
  createdAt: string;
  updatedAt: string;
  profile: ProfileData;
  sessionCount: number;
};
