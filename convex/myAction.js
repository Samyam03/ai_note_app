
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai"
import {v} from "convex/values";


export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string()
  },
  handler: async (ctx ,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,
      args.fileId,
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY ,
        model: "embedding-001", 
        taskType: TaskType.RETRIEVAL_DOCUMENT, 
        title: "Document Title",
      }),
      { ctx }
    );
    return "Embedding completed successfully"
  },
});

export const search= action({
  args:{
    query: v.string(),
    fileId: v.string()
  },
  handler: async(ctx,args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document Title",
      }),
      { ctx }
      
    )
    const rawResults = await vectorStore.similaritySearch(args.query, 5);
const resultsOne = rawResults.filter(q => q.metadata.fileId == args.fileId);
console.log("Results One: ", resultsOne);

return JSON.stringify(resultsOne);
  }

}) 
