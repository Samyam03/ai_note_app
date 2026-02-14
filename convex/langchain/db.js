// Re-export everything from LangChain's Convex utils, then override insert
// so we store top-level fileId (from metadata) for query-by-fileId fallback.
import {
  get,
  lookup,
  upsert,
  deleteMany,
} from "@langchain/community/utils/convex";
import { internalMutation, internalQuery } from "../_generated/server.js";
import { v } from "convex/values";

export { get, lookup, upsert, deleteMany };

/** Insert with top-level fileId so we can index and query by fileId. */
export const insert = internalMutation({
  args: { table: v.string(), document: v.any() },
  handler: async (ctx, args) => {
    const doc = { ...args.document };
    if (
      args.table === "documents" &&
      doc.metadata != null &&
      doc.metadata.fileId != null
    ) {
      doc.fileId = doc.metadata.fileId;
    }
    await ctx.db.insert(args.table, doc);
  },
});

/** Fetch document chunks by fileId when vector search returns none (e.g. filter not applied). */
export const getByFileId = internalQuery({
  args: { fileId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .take(10);
  },
});
