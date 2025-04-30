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
        apiKey: process.env.GOOGLE_API_KEY,
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
        apiKey: process.env.GOOGLE_API_KEY,
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document Title",
      }),
      { ctx }
    );
    
    // First try with filter parameter 
    try {
      const results = await vectorStore.similaritySearch(
        args.query, 
        5, 
        { fileId: args.fileId }
      );
      console.log("Results with filter: ", results);
      return JSON.stringify(results);
    } catch (error) {
      console.log("Filter parameter error, falling back to post-filtering: ", error);
      
      // Fallback: get results and filter them afterward
      const rawResults = await vectorStore.similaritySearch(args.query, 10);
      const filteredResults = rawResults.filter(item => 
        item.metadata && item.metadata.fileId === args.fileId
      );
      
      console.log("Filtered results: ", filteredResults);
      return JSON.stringify(filteredResults);
    }
  }
});