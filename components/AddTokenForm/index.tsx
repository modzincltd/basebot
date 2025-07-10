'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

type AddTokenFormProps = {
  chain?: string // optional prop
}

export default function AddTokenForm({ chain: defaultChain = 'BASE' }: AddTokenFormProps) {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [chain, setChain] = useState(defaultChain)
  const [status, setStatus] = useState('paused') // default status

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/tokens/add', {
        method: 'POST',
        body: JSON.stringify({ address, name, chain, status }),
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setMessage(`✅ Token "${result.name}" added successfully!`)
      setAddress('')
      setName('')
      setChain(defaultChain)
      setStatus('New')

         toast.success(`Token "${result.name}" added!`)
    } catch (err: any) {
   
      setError(`❌ Error: ${err.message}`)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
        <input
          className="border p-2 col-span-4"
          placeholder="Token Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="border p-2 col-span-2"
          placeholder="Token Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select className="border col-span-2" value={chain} onChange={(e) => setChain(e.target.value)}>
          <option value={chain}>{chain}</option>
          <option value="BASE">BASE</option>
          <option value="ETH">ETH</option>
          <option value="SOLANA">SOLANA</option>
        </select>

        <select className="border col-span-2" value={status} onChange={(e) => setStatus(e.target.value)}>
         
          <option value="paused">Paused</option>
          <option value="live">Live</option>
          <option value="removed">Removed</option>
        </select>

        <button className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Add Token
        </button>
      </form>

      {/* Notification */}
      {message && <p className="col-span-12 text-green-600 mt-2">{message}</p>}
      {error && <p className="col-span-12 text-red-600 mt-2">{error}</p>}
    </>
  )
}
