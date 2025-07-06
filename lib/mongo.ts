import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let isConnected = false;

async function connectDB(): Promise<MongoClient> {
  if (!isConnected) {
    client = new MongoClient(uri, options);
    await client.connect();
    isConnected = true;
  }
  return client;
}

export default connectDB;
