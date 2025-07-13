export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period) return NaN;

  let gains = 0, losses = 0;

  for (let i = 1; i < period; i++) {
    const delta = prices[i] - prices[i - 1];
    if (delta >= 0) gains += delta;
    else losses -= delta;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};
