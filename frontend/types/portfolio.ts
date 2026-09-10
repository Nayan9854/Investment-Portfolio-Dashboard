export interface Holding {
  name: string;
  symbol: string;
  yahooSymbol: string;
  googleSymbol: string;
  exchange: "NSE" | "BSE";
  purchasePrice: number;
  quantity: number;
  sector: string;
}

export interface CalculatedHolding extends Holding {
  cmp: number;
  investment: number;
  portfolioPercentage: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  latestEarnings: number | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
}