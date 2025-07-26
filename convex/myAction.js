import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai"
import { v } from "convex/values";

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
        model: "embedding-001", 
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
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document Title",
      }),
      { ctx }
    );
    
    // Optimized search with reduced results and direct filtering
    try {
      const results = await vectorStore.similaritySearch(
        args.query, 
        3, // Reduced from 5 to 3 for faster processing
        { fileId: args.fileId }
      );
      return JSON.stringify(results);
    } catch (error) {
      // Fallback with reduced results
      const rawResults = await vectorStore.similaritySearch(args.query, 5); // Reduced from 10 to 5
      const filteredResults = rawResults.filter(item => 
        item.metadata && item.metadata.fileId === args.fileId
      ).slice(0, 3); // Limit to top 3 results
      
      return JSON.stringify(filteredResults);
    }
  }
});