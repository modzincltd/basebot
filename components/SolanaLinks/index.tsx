import Link from 'next/link';

export default function SolanaLinks({tokenAddress}: { tokenAddress: string }) {

    return (
        <div className="flex flex-row gap-4">
            <Link href={`https://jup.ag/tokens/${tokenAddress}`} target="_blank" className='bg-gray-100 px-2 py-1 rounded hover:bg-slate-900 hover:text-white'>JUP</Link>
            <Link href={`https://raydium.io/swap/?inputMint=${tokenAddress}&outputMint=sol`} target="_blank" className='bg-gray-100 px-2 py-1 rounded hover:bg-slate-900 hover:text-white'>RYD</Link>
            <Link href={`https://dexscreener.com/solana/${tokenAddress}`} target="_blank" className='bg-gray-100 px-2 py-1 rounded hover:bg-slate-900 hover:text-white'>DS</Link>
            <Link href={`https://solscan.io/token/${tokenAddress}`} target="_blank" className='bg-gray-100 px-2 py-1 rounded hover:bg-slate-900 hover:text-white'>SS</Link>
        </div>
    )
    
} 