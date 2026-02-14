import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action, internalQuery, internalMutation } from "./_generated/server.js";
import { internal } from "./_generated/api.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

/** Internal: list documents for backfill (id + metadata). */
export const listDocumentsForBackfill = internalQuery({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("documents").collect();
    return docs.map((d) => ({ _id: d._id, metadata: d.metadata }));
  },
});

/** Internal: list documents with text + metadata (for fallback when index has no fileId). */
export const listDocumentsWithContent = internalQuery({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("documents").collect();
    return docs.map((d) => ({ text: d.text, metadata: d.metadata, fileId: d.fileId }));
  },
});

/** Internal: set top-level fileId on a document. */
export const patchDocumentFileId = internalMutation({
  args: { id: v.id("documents"), fileId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { fileId: args.fileId });
  },
});

/** One-time: backfill top-level fileId from metadata so getByFileId finds existing chunks. Run from dashboard or Convex UI. */
export const backfillFileId = action({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.runQuery(internal.myAction.listDocumentsForBackfill, {});
    let updated = 0;
    for (const { _id, metadata } of docs) {
      if (metadata?.fileId != null) {
        await ctx.runMutation(internal.myAction.patchDocumentFileId, {
          id: _id,
          fileId: metadata.fileId,
        });
        updated += 1;
      }
    }
    return { updated };
  },
});

export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    // Create a metadata object for each text chunk
    const metadataArray = args.splitText.map(() => ({
      fileId: args.fileId
    }));

    await ConvexVectorStore.fromTexts(
      args.splitText,
      metadataArray, // Pass an array of metadata objects, one per text chunk
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        model: "gemini-embedding-001",
        modelName: "gemini-embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document Title",
      }),
      { ctx }
    );
    return "Embedding completed successfully";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async(ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        model: "gemini-embedding-001",
        modelName: "gemini-embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document Title",
      }),
      { ctx }
    );

    // 1) Vector search: fetch many candidates, filter by fileId
    const fileId = args.fileId.trim();
    const limit = 256;
    const rawResults = await vectorStore.similaritySearch(args.query, limit);
    const filtered = rawResults.filter(
      (item) =>
        (item.metadata?.fileId && item.metadata.fileId.trim() === fileId) ||
        (item.fileId && item.fileId.trim() === fileId)
    ).slice(0, 5);

    if (filtered.length > 0) {
      return JSON.stringify(filtered);
    }

    // 2) Fallback: fetch by index (needs top-level fileId)
    const byFileId = await ctx.runQuery(internal["langchain/db"].getByFileId, {
      fileId,
    });
    if (byFileId.length > 0) {
      const asDocs = byFileId.slice(0, 5).map((doc) => ({
        pageContent: doc.text,
        metadata: doc.metadata ?? {},
        text: doc.text,
      }));
      return JSON.stringify(asDocs);
    }

    // 3) Last resort: scan all docs, filter by metadata.fileId (works for old docs without top-level fileId)
    const all = await ctx.runQuery(internal.myAction.listDocumentsWithContent, {});
    const forFile = all.filter(
      (d) => d.metadata?.fileId === fileId || d.fileId === fileId
    );
    const asDocs = forFile.slice(0, 5).map((doc) => ({
      pageContent: doc.text,
      metadata: doc.metadata ?? {},
      text: doc.text,
    }));
    return JSON.stringify(asDocs);
  }
});