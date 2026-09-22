import { CatalogRepository } from "./types";
import { MockCatalogRepository } from "./mock-repository";
import { SupabaseCatalogRepository } from "./supabase-repository";

export * from "./types";
export * from "./mock-data";
export { MockCatalogRepository } from "./mock-repository";
export { SupabaseCatalogRepository } from "./supabase-repository";

let repositoryInstance: CatalogRepository | null = null;

/**
 * Returns the singleton catalog repository instance.
 * Automatically selects SupabaseCatalogRepository if Supabase environment variables are set,
 * or MockCatalogRepository with normalized DEMO DATA otherwise.
 */
export function getCatalogRepository(): CatalogRepository {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    repositoryInstance = new SupabaseCatalogRepository(supabaseUrl, supabaseKey);
    return repositoryInstance;
  }

  // Fallback to normalized relational demo repository
  repositoryInstance = new MockCatalogRepository();
  return repositoryInstance;
}
