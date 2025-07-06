import connectDB from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.description || !data.amount || !data.date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await connectDB();
    const db = client.db("priya"); // use your actual DB name
    const collection = db.collection("transactions");

    const result = await collection.insertOne(data);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
