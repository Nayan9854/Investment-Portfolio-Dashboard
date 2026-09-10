import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function getQuote(symbol: string) {
  const quote = await yahooFinance.quote(symbol);

  return {
    symbol: quote.symbol,
    price: quote.regularMarketPrice,
    currency: quote.currency,
  };
}

export async function getQuotes(symbols: string[]) {
  const quotes = await yahooFinance.quote(symbols);

  return quotes.map((quote) => ({
    symbol: quote.symbol,
    price: quote.regularMarketPrice,
    currency: quote.currency,
  }));
}