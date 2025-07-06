import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongo";

export async function GET() {
  const client = await connectDB();
  const db = client.db("priya");
  const transactions = await db.collection("transactions").find({}).toArray();
return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const client = await connectDB();
  const db = client.db("priya");
  const body = await request.json();
  const result = await db.collection("transactions").insertOne(body);
  return NextResponse.json({ insertedId: result.insertedId });}
