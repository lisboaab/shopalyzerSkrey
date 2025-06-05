import { getStoreServer } from "@/lib/services/serverQueries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { shopId: string } }
) {
  const { shopId } = await params;
  const authToken = request.headers.get('Authorization');

  if (!authToken) {
    return NextResponse.json(
      { error: "No authentication token provided" },
      { status: 401 }
    );
  }
  try {
    const credentials = await getStoreServer(shopId, authToken);
    if(!credentials){
      throw new Error("No credentials provided by store");
    }

    const body = await request.json();

    const shopifyResponse = await fetch(
      `https://${credentials.shopUrl}/admin/api/2025-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": credentials.APIToken,
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!shopifyResponse.ok) {
      console.error("Shopify error:", await shopifyResponse.text());
      throw new Error(`Shopify responded with ${shopifyResponse.status}`);
    }

    const data = await shopifyResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
