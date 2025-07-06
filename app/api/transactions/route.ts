import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";

export async function GET() {
  const client = await connectDB(); // ✅ parenthesis because it's a function
  const db = client.db("priya");
  const transactions = await db.collection("transactions").find({}).toArray();

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const client = await connectDB();
  const db = client.db("priya");
  const body = await request.json();

  const { description, amount } = body;

  if (!description || typeof amount !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await db.collection("transactions").insertOne({
    description,
    amount,
    date: new Date().toISOString(), // 👈 critical fix!
  });

  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

