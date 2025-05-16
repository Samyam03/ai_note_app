import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addFileEntryToDB = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      createdBy:args.createdBy,
      fileUrl: args.fileUrl,
    });
    return result;
  }
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const getFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    if(args?.userEmail){
      return;
    }
    const result = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    return result[0];
  },
});

export const getAllFiles = query({
  args: {
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userEmail) {
      return [];
    }

    const result = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("createdBy"), args.userEmail))
      .collect();

    return result;
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.string(),
    storageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let storageId = args.storageId;

    if (!storageId) {
      const [doc] = await ctx.db
        .query("pdfFiles")
        .filter((q) => q.eq(q.field("fileId"), args.fileId))
        .collect();

      if (!doc) throw new Error("File not found in database");
      storageId = doc.storageId;

      if (!storageId) throw new Error("Missing storageId in record");
      await ctx.db.delete(doc._id);
    } else {
      const [doc] = await ctx.db
        .query("pdfFiles")
        .filter((q) => q.eq(q.field("fileId"), args.fileId))
        .collect();

      if (!doc?._id) throw new Error("File not found in database");

      await ctx.storage.delete(storageId);
      await ctx.db.delete(doc._id);
    }

    return { success: true };
  },
});



