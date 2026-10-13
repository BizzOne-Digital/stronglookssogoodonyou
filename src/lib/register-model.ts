import mongoose, { type Model, type Schema } from "mongoose";

const globalCache = globalThis as typeof globalThis & {
  __slgoyMongooseModels?: Map<string, Model<unknown>>;
};

function modelCache() {
  if (!globalCache.__slgoyMongooseModels) {
    globalCache.__slgoyMongooseModels = new Map();
  }
  return globalCache.__slgoyMongooseModels;
}

/** Register once; safe when `mongoose.models` is undefined (Turbopack). */
export function registerModel<T>(name: string, schema: Schema<T>): Model<T> {
  const cache = modelCache();
  const cached = cache.get(name);
  if (cached) return cached as Model<T>;

  const registry = mongoose.models;
  if (registry?.[name]) {
    const existing = registry[name] as Model<T>;
    cache.set(name, existing as Model<unknown>);
    return existing;
  }

  const created = mongoose.model<T>(name, schema);
  cache.set(name, created as Model<unknown>);
  return created;
}
