interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice?: number;
        currency?: string;
      };
    }> | null;
  };
}

async function fetchQuote(symbol: string) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/` +
    `${encodeURIComponent(symbol)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Yahoo Finance request failed for ${symbol}: ${response.status}`
    );
  }

  const data =
    (await response.json()) as YahooChartResponse;

  const result = data.chart.result?.[0];

  if (!result) {
    throw new Error(
      `No Yahoo Finance data found for ${symbol}`
    );
  }

  return {
    symbol: result.meta.symbol,
    price: result.meta.regularMarketPrice ?? 0,
    currency: result.meta.currency,
  };
}

export async function getQuote(symbol: string) {
  return fetchQuote(symbol);
}

export async function getQuotes(symbols: string[]) {
  const quotes = [];

  for (const symbol of symbols) {
    const quote = await fetchQuote(symbol);
    quotes.push(quote);
  }

  return quotes;
}