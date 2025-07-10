// components/TokenMetaPanel.tsx
export default function TokenMetaPanel({ token }: { token: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-4 rounded-lg bg-white shadow">
      <div><strong>Address:</strong> {token.address}</div>
      <div><strong>Status:</strong> {token.status}</div>
      <div><strong>Chain:</strong> {token.chain}</div>
      <div><strong>Created:</strong> {new Date(token.createdAt).toLocaleString()}</div>
    </div>
  )
}
