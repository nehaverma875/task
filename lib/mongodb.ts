import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ops-admin-dashboard";

let clientPromise: Promise<MongoClient> | undefined;

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI. Copy .env.example to .env.local and set your MongoDB connection string.");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  return client.db(dbName);
}
