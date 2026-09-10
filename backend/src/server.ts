import express from "express";
import cors from "cors";
import { portfolio } from "./data/portfolio";
import {
  getQuote,
  getQuotes,
} from "./services/yahooFinance";
import { getGoogleFinanceData } from "./services/googleFinance";
import {
  calculateHolding,
  calculateSectorSummaries,
  calculateTotalInvestment,
} from "../../frontend/utils/calculations";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/api/portfolio", async (_req, res) => {
  try {
    const totalInvestment =
      calculateTotalInvestment(portfolio);

    const symbols = portfolio.map(
      (holding) => holding.yahooSymbol
    );

    const quotes = await getQuotes(symbols);

    const calculatedHoldings = await Promise.all(
      portfolio.map(async (holding) => {
        const quote = quotes.find(
          (quote) =>
            quote.symbol === holding.yahooSymbol
        );

        const cmp = quote?.price ?? 0;

        const googleData =
          await getGoogleFinanceData(
            holding.googleSymbol
          );

        return calculateHolding(
          holding,
          cmp,
          totalInvestment,
          googleData.peRatio,
          googleData.latestEarnings
        );
      })
    );

    const sectorSummaries =
      calculateSectorSummaries(
        calculatedHoldings
      );

    res.json({
      totalInvestment,
      holdings: calculatedHoldings,
      sectors: sectorSummaries,
    });
  } catch (error) {
    console.error(
      "Portfolio error:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch portfolio data",
    });
  }
});

app.get("/api/quote/:symbol", async (req, res) => {
  try {
    const quote = await getQuote(
      req.params.symbol
    );

    res.json(quote);
  } catch (error) {
    console.error(
      "Yahoo Finance error:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch stock quote",
    });
  }
});

app.get(
  "/api/google-finance/:symbol",
  async (req, res) => {
    try {
      const data =
        await getGoogleFinanceData(
          req.params.symbol
        );

      res.json(data);
    } catch (error) {
      console.error(
        "Google Finance error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to fetch Google Finance data",
      });
    }
  }
);

app.get("/api/quotes", async (_req, res) => {
  try {
    const symbols = portfolio.map(
      (holding) => holding.yahooSymbol
    );

    const quotes = await getQuotes(symbols);

    res.json(quotes);
  } catch (error) {
    console.error(
      "Yahoo Finance error:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch stock quotes",
    });
  }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});