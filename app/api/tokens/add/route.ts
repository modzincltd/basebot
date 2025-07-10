import { connectToDB } from "@/lib/mongo";
import Token from "@/models/Token";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDB();

    const newToken = await Token.create({
      address: body.address,
      name: body.name,
      chain: body.chain.toLowerCase(), // Ensure chain is lowercase
      status: body.status.toLowerCase() || "paused",
    });

    return new Response(JSON.stringify(newToken), { status: 201 });
  } catch (error) {
    console.error("Add token error:", error);
    return new Response(JSON.stringify({ error: "Failed to add token" }), { status: 500 });
  }
}
