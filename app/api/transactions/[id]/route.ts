// app/api/transactions/[id]/route.ts
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db("priya");

  const result = await db
    .collection("transactions")
    .deleteOne({ _id: new ObjectId(params.id) });

  return NextResponse.json({ success: result.deletedCount === 1 });
}
