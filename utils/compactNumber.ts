// lib/formatCompactNumber.ts
export function compactNumber(num: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

export default compactNumber
 