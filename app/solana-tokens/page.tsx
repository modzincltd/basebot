import AddTokenForm from "@/components/AddTokenForm";
import TokenTable from "@/components/TokenTable";

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Solana Token List</h1>
      
      {/* You can add a placeholder component or message here */}

      <AddTokenForm chain="SOLANA" /> 

      <TokenTable chain="SOLANA"  />
    </div>
  );
}    