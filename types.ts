export enum DealStatus {
  GREAT = "Great",
  GOOD = "Good",
  FAIR = "Fair",
  BAD = "Bad",
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  currentPrice: number;
  originalPrice: number; // MSRP or high point
  currency: string;
  image: string; // Product image URL
  description: string;
  history: PricePoint[];
  rating: number;
  reviewCount: number;
  dealStatus: DealStatus;
  advice: string;
  addedAt: number;
}
