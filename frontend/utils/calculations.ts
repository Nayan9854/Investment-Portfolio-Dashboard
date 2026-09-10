import {
  CalculatedHolding,
  Holding,
  SectorSummary,
} from "../types/portfolio";

// 1. Investment
export function calculateInvestment(
  purchasePrice: number,
  quantity: number
): number {
  return purchasePrice * quantity;
}

// 2. Present Value
export function calculatePresentValue(
  cmp: number,
  quantity: number
): number {
  return cmp * quantity;
}

// 3. Gain/Loss
export function calculateGainLoss(
  presentValue: number,
  investment: number
): number {
  return presentValue - investment;
}

// 4. Portfolio %
export function calculatePortfolioPercentage(
  investment: number,
  totalInvestment: number
): number {
  if (totalInvestment === 0) {
    return 0;
  }

  return (investment / totalInvestment) * 100;
}

// 5. Calculate one complete holding
export function calculateHolding(
  holding: Holding,
  cmp: number,
  totalInvestment: number,
  peRatio: number | null,
  latestEarnings: number | null
): CalculatedHolding {
  const investment = calculateInvestment(
    holding.purchasePrice,
    holding.quantity
  );

  const presentValue = calculatePresentValue(
    cmp,
    holding.quantity
  );

  const gainLoss = calculateGainLoss(
    presentValue,
    investment
  );

  const portfolioPercentage = calculatePortfolioPercentage(
    investment,
    totalInvestment
  );

  return {
    ...holding,
    cmp,
    investment,
    portfolioPercentage,
    presentValue,
    gainLoss,
    peRatio,
    latestEarnings,
  };
}

// 6. Total investment
export function calculateTotalInvestment(
  holdings: Holding[]
): number {
  return holdings.reduce((total, holding) => {
    return total + calculateInvestment(
      holding.purchasePrice,
      holding.quantity
    );
  }, 0);
}

// 7. Sector summaries
export function calculateSectorSummaries(
  holdings: CalculatedHolding[]
): SectorSummary[] {
  const sectors: Record<string, SectorSummary> = {};

  for (const holding of holdings) {
    if (!sectors[holding.sector]) {
      sectors[holding.sector] = {
        sector: holding.sector,
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
      };
    }

    sectors[holding.sector].totalInvestment += holding.investment;
    sectors[holding.sector].totalPresentValue += holding.presentValue;
    sectors[holding.sector].totalGainLoss += holding.gainLoss;
  }

  return Object.values(sectors);
}