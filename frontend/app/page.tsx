"use client";

import {
  Fragment,
  useEffect,
  useState,
} from "react";

import {
  CalculatedHolding,
  SectorSummary,
} from "@/types/portfolio";

interface PortfolioResponse {
  totalInvestment: number;
  holdings: CalculatedHolding[];
  sectors: SectorSummary[];
}

function formatFinancialValue(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `₹${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `₹${(value / 1_000_000).toFixed(2)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `₹${(value / 1_000).toFixed(2)}K`;
  }

  return `₹${value.toFixed(2)}`;
}

export default function Home() {
  const [portfolio, setPortfolio] =
    useState<PortfolioResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`
);

        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }

        const data: PortfolioResponse =
          await response.json();

        setPortfolio(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(
          "Error fetching portfolio:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();

    const interval = setInterval(
      fetchPortfolio,
      15000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <p className="p-8 text-white">
        Loading portfolio...
      </p>
    );
  }

  if (!portfolio) {
    return (
      <p className="p-8 text-white">
        Failed to load portfolio.
      </p>
    );
  }

  const totalPresentValue =
    portfolio.holdings.reduce(
      (total, holding) =>
        total + holding.presentValue,
      0
    );

  const totalGainLoss =
    portfolio.holdings.reduce(
      (total, holding) =>
        total + holding.gainLoss,
      0
    );

  const totalGainLossPercentage =
    portfolio.totalInvestment === 0
      ? 0
      : (totalGainLoss /
          portfolio.totalInvestment) *
        100;

  const groupedHoldings =
  portfolio.holdings.reduce<
    Record<string, CalculatedHolding[]>
  >((groups, holding) => {
    if (!groups[holding.sector]) {
      groups[holding.sector] = [];
    }

    groups[holding.sector].push(holding);

    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-black p-8 text-white">

      {/* Page heading */}
      <h1 className="text-3xl font-bold">
        Portfolio Dashboard
      </h1>

      {/* Last updated */}
      {lastUpdated && (
        <p className="mt-2 text-sm text-gray-400">
          Last updated:{" "}
          {lastUpdated.toLocaleTimeString("en-IN")}
        </p>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">

        {/* Total Investment */}
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-sm">
          <p className="text-sm text-gray-400">
            Total Investment
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            ₹
            {portfolio.totalInvestment.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        {/* Present Value */}
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-sm">
          <p className="text-sm text-gray-400">
            Present Value
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            ₹
            {totalPresentValue.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        {/* Total Gain/Loss */}
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-sm">
          <p className="text-sm text-gray-400">
            Total Gain/Loss
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              totalGainLoss >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {totalGainLoss >= 0 ? "+" : "-"}₹
            {Math.abs(totalGainLoss).toLocaleString(
              "en-IN"
            )}
          </p>

          <p
            className={
              totalGainLoss >= 0
                ? "mt-1 text-sm text-green-500"
                : "mt-1 text-sm text-red-500"
            }
          >
            {totalGainLossPercentage >= 0
              ? "+"
              : ""}
            {totalGainLossPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Sector Performance */}
      <div className="mt-10">

        <h2 className="mb-4 text-xl font-semibold">
          Sector Performance
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {portfolio.sectors.map((sector) => {

            const sectorGainLossPercentage =
              sector.totalInvestment === 0
                ? 0
                : (sector.totalGainLoss /
                    sector.totalInvestment) *
                  100;

            return (
              <div
                key={sector.sector}
                className="rounded-xl border border-gray-700 bg-gray-950 p-5 transition hover:border-gray-500"
              >

                {/* Sector heading */}
                <div className="flex items-center justify-between">

                  <h3 className="text-lg font-semibold text-white">
                    {sector.sector}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      sector.totalGainLoss >= 0
                        ? "bg-green-950 text-green-400"
                        : "bg-red-950 text-red-400"
                    }`}
                  >
                    {sectorGainLossPercentage >= 0
                      ? "+"
                      : ""}
                    {sectorGainLossPercentage.toFixed(
                      2
                    )}
                    %
                  </span>

                </div>

                {/* Sector values */}
                <div className="mt-4 space-y-2">

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      Investment
                    </span>

                    <span className="text-sm font-medium text-gray-200">
                      ₹
                      {sector.totalInvestment.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      Present Value
                    </span>

                    <span className="text-sm font-medium text-gray-200">
                      ₹
                      {sector.totalPresentValue.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-800 pt-2">

                    <span className="text-sm text-gray-400">
                      Gain/Loss
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        sector.totalGainLoss >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {sector.totalGainLoss >= 0
                        ? "+"
                        : "-"}₹
                      {Math.abs(
                        sector.totalGainLoss
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Holdings */}
      <div className="mt-8">

        <h2 className="mb-4 text-xl font-semibold">
          Holdings
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-700">

          <table className="min-w-full bg-gray-950">

            <thead className="bg-gray-900">

              <tr>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Stock
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Purchase Price
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Qty
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Investment
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Portfolio %
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  NSE/BSE
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  CMP
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Present Value
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Gain/Loss
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  P/E Ratio
                </th>

                <th className="whitespace-nowrap border-b border-gray-700 p-3 text-left text-sm font-semibold text-gray-300">
                  Latest Earnings
                </th>

              </tr>

            </thead>

<tbody>
  {Object.entries(groupedHoldings).map(
    ([sector, holdings]) => (
      <Fragment key={sector}>
        <tr>
          <td
            colSpan={11}
            className="border-b border-gray-700 bg-gray-900 px-4 py-3 text-left text-sm font-bold text-white"
          >
            {sector}
          </td>
        </tr>

        {holdings.map((holding) => (
          <tr
            key={holding.symbol}
            className="transition-colors hover:bg-slate-700"
          >
            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-white">
              {holding.name}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              ₹
              {holding.purchasePrice.toLocaleString(
                "en-IN"
              )}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              {holding.quantity}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              ₹
              {holding.investment.toLocaleString(
                "en-IN"
              )}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              {holding.portfolioPercentage.toFixed(
                2
              )}
              %
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              {holding.exchange}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              ₹
              {holding.cmp.toLocaleString(
                "en-IN"
              )}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              ₹
              {holding.presentValue.toLocaleString(
                "en-IN"
              )}
            </td>

            <td
              className={`whitespace-nowrap border-b border-gray-800 p-3 ${
                holding.gainLoss >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {holding.gainLoss >= 0
                ? "+"
                : "-"}₹
              {Math.abs(
                holding.gainLoss
              ).toLocaleString("en-IN")}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              {holding.peRatio !== null
                ? holding.peRatio.toFixed(2)
                : "N/A"}
            </td>

            <td className="whitespace-nowrap border-b border-gray-800 p-3 text-gray-300">
              {holding.latestEarnings !== null
                ? formatFinancialValue(
                    holding.latestEarnings
                  )
                : "N/A"}
            </td>
          </tr>
        ))}
      </Fragment>
    )
  )}
</tbody>

          </table>

        </div>
      </div>

    </main>
  );
}