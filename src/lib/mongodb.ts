import mongoose from "mongoose";
import { ensureMongooseModels } from "@/lib/ensure-mongoose-models";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectMongo(): Promise<typeof mongoose> {
  ensureMongooseModels();
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const dbName = process.env.MONGODB_DB || "slgoy";
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName,
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
