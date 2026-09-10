const cache = new Map<
  string,
  {
    peRatio: number | null;
    latestEarnings: number | null;
    timestamp: number;
  }
>();

const CACHE_DURATION = 60 * 60 * 1000;

export async function getGoogleFinanceData(symbol: string) {
  const cached = cache.get(symbol);

  if (
    cached &&
    Date.now() - cached.timestamp < CACHE_DURATION
  ) {
    return {
      symbol,
      peRatio: cached.peRatio,
      latestEarnings: cached.latestEarnings,
    };
  }

  const url = `https://www.google.com/finance/quote/${symbol}?hl=en`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Google Finance request failed: ${response.status}`
    );
  }

  const html = await response.text();

  const peMatch = html.match(
    /P\/E ratio<\/div>[\s\S]*?<div class="P6K39c">([\d.]+)<\/div>/
  );

  const peRatio = peMatch
    ? Number(peMatch[1])
    : null;

  const earningsMatch = html.match(
  /<tr class="roXhBd">[\s\S]*?<div class="rsPbEe"[^>]*>Net income<\/div>[\s\S]*?<td class="QXDnM">([\d.]+)([BM])<\/td>/
);

  let latestEarnings: number | null = null;

  if (earningsMatch) {
    const value = Number(earningsMatch[1]);
    const unit = earningsMatch[2];

    latestEarnings =
      unit === "B"
        ? value * 1_000_000_000
        : value * 1_000_000;
  }

  cache.set(symbol, {
  peRatio,
  latestEarnings,
  timestamp: Date.now(),
});

return {
  symbol,
  peRatio,
  latestEarnings,
};
}