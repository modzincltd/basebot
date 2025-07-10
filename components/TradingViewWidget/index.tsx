// components/TradingViewWidget.tsx
'use client'

import { useEffect } from 'react'

export default function TradingViewWidget({ symbol }: { symbol: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        symbol,
        width: '100%',
        height: '400',
        locale: 'en',
        dateRange: '12M',
        colorTheme: 'light',
        isTransparent: false,
        autosize: true,
        largeChartUrl: ''
      })
      document.getElementById('tradingview-widget')?.appendChild(script)
    }
  }, [symbol])

  return <div id="tradingview-widget" className="w-full h-[400px]" />
}
