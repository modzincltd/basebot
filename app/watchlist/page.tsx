import CoinbaseWalletConnect from '@/components/CoinbaseWalletConnect'

export default function WatchlistPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <CoinbaseWalletConnect />
      {/* Add watchlist and limit order UI here */}
    </div>
  )
}
