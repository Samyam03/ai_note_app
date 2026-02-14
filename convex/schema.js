import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userName: v.string(),
        email: v.string(),
        imageUrl: v.string()
    }),
    pdfFiles: defineTable({
        fileId: v.string(),
        storageId: v.string(),
        fileName: v.string(),
        fileUrl: v.string(),
        createdBy: v.string()
    }),
    documents: defineTable({
        embedding: v.array(v.number()),
        text: v.string(),
        metadata: v.any(),
        fileId: v.optional(v.string()),
    })
        .index("by_fileId", ["fileId"])
        .vectorIndex("byEmbedding", {
            vectorField: "embedding",
            dimensions: 3072,
            filterFields: ["metadata.fileId"],
        }),
    notes: defineTable({
        fileId: v.string(),
        notes: v.any(),
        createdBy: v.string()
    }).index("by_fileId", ["fileId"]),
});