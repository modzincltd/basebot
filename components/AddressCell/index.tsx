"use client"
import { useState } from "react"

function AddressCell({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  const shortAddress = `${address.slice(0, 3)}...${address.slice(-3)}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000) // reset after 1 sec
  }

  return (
    <td className=" p-2 font-mono text-xs flex items-center gap-2">
      <span>{shortAddress}</span>
      <button
        onClick={copyToClipboard}
        className="text-blue-600 "
        title="Copy full address"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </td>
  )
}

export default AddressCell
