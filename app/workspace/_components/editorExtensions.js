'use client'

import { api } from "@/convex/_generated/api";
import React, { useState } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUndo,
  FaRedo,
  FaQuoteLeft,
  FaListUl,
  FaHeading,
  FaMagic,
  FaSpinner,
} from "react-icons/fa";
import { useAction } from "convex/react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { generateAIResponse } from "@/configs/aiModel";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function EditorExtensions({ editor }) {
  const { fileId } = useParams();
  const searchAI = useAction(api.myAction.search);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveNotes = useMutation(api.notes.saveNotes);
  const { user } = useUser();

  const onAIClick = async () => {
    if (!editor || isGenerating) return;

    toast("AI is fetching the result");
    setIsGenerating(true);

    try {
      const { from, to } = editor.state.selection;
      const hasSelection = !editor.state.selection.empty;
      const selectedText = hasSelection
        ? editor.state.doc.textBetween(from, to, " ")
        : editor.getText();

      if (!selectedText.trim()) {
        toast.error("Please select some text or add content to your document");
        return;
      }

      const searchResult = await searchAI({
        query: selectedText,
        fileId: fileId,
      });

      const unformattedAnswer = JSON.parse(searchResult);
      let context = "";
      unformattedAnswer?.forEach((item) => {
        context += item.pageContent + "\n\n";
      });

      if (!context.trim()) {
        toast.error("No relevant context found for your query");
        return;
      }

      const prompt = `You are an advanced document formatting assistant. Follow these STRICT RULES:

      1. PRIORITIZE EXPLICIT INSTRUCTIONS:
         - If query contains formatting commands (e.g., "in 3 points", "as list", "use headings"):
           * Implement EXACTLY as specified
           * Match quantity/type precisely (3 bullet points = 3 <li> items)
           * Use matching HTML tags immediately without commentary
      
      2. FORMATTING TEMPLATES (when no explicit instructions):
      
         DESCRIPTIVE QUERIES:
         <h3><strong>Contextual Background</strong></h3>
         <p>[Comprehensive introduction establishing relevance and historical context]</p>
         <p>[Detailed explanation of key concepts and terminology]</p>
         <p>[Current state of affairs and why this matters now]</p>
      
         <h3><strong>In-Depth Analysis</strong></h3>
         <p>[Thorough examination of all relevant aspects with supporting evidence]</p>
         <p>[Multiple paragraphs analyzing different perspectives and viewpoints]</p>
         <p>[Detailed case studies or real-world examples where applicable]</p>
         <p>[Statistical data or research findings when available]</p>
         <p>[Comparative analysis with similar concepts or alternative approaches]</p>
      
         <h3><strong>Insights</strong></h3>
      
         <strong>1. [Detailed Insight Title]</strong>
         <p>[Expanded explanation with multiple supporting points]</p>
         <p>[Practical implications and potential applications]</p>
         <p>[Limitations or counterarguments to consider]</p>
      
         <strong>2. [Detailed Insight Title]</strong>
         <p>[Expanded explanation with multiple supporting points]</p>
         <p>[Practical implications and potential applications]</p>
         <p>[Limitations or counterarguments to consider]</p>
      
         <strong>3. [Detailed Insight Title]</strong>
         <p>[Expanded explanation with multiple supporting points]</p>
         <p>[Practical implications and potential applications]</p>
         <p>[Limitations or counterarguments to consider]</p>
      
         <h3><strong>Conclusion</strong></h3>
         <p>[Comprehensive summary synthesizing all key points]</p>
         <p>[Future outlook and potential developments]</p>
         <p>[Actionable recommendations or next steps]</p>
      
         <h3><strong>Summary</strong></h3>
         <p>[Detailed recap of most critical elements and their significance]</p>
         <p>[Key takeaways highlighted for quick reference]</p>
      
         DIRECT QUESTIONS:
         <p>[Single concise answer in 1-2 sentences]</p>
      
      3. CONTENT RULES:
         - Use headings only when instructed or for multi-section answers
         - Bold ONLY section titles and insight headers
         - Lists must match requested count exactly
         - Never add markdown, only use allowed HTML tags
      
      4. ERROR CONDITIONS:
         <h3>Missing Information</h3>
         <p>Required: [Specific data needed]</p>
         <p>Example formats: [Bullet list of options]</p>
      
      ALLOWED TAGS: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>
      
      QUESTION:
      
      
      CONTEXT:
      ${context}
      
      QUERY: "${selectedText}"
      
      Respond ONLY with properly tagged content. No explanations. No markdown. Never apologize.`;

      const response = await generateAIResponse(prompt);

      // Improved cleaning and trimming
      let cleanedResponse = response
        .replace(/```html|```/g, "")
        .replace(/^"+|"+$/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .replace(/^\s+|\s+$/g, "")
        .replace(/(<[^>]+>)\s+/g, "$1")
        .replace(/\s+(<\/[^>]+>)/g, "$1")
        .trim();

      // Fix: Compact HTML template to avoid extra spaces
      const formattedContent = `<div style="background-color: #eff6ff; border-radius: 0.5rem; margin: 1rem 0; border: 1px solid #bfdbfe; overflow: auto; width: 100%;"><strong>QUESTION: ${selectedText}</strong>
      <div><strong>ANSWER:</strong> ${cleanedResponse}</div></div>`;

      // Insert the formatted response
      editor.chain().focus().insertContent(formattedContent).run();

      // Save the notes
      saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
    } catch (error) {
      console.error("AI generation failed:", error);
      toast.error("AI generation failed");

      // Insert error message
      editor.commands.insertContent(`
        <div style="background-color: #fee2e2; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border: 1px solid #fecaca;">
          <p style="color: #b91c1c; font-weight: 500;">Error: Could not generate AI response</p>
          <p style="color: #ef4444; font-size: 0.875rem;">${error.message || "Please try again later"}</p>
        </div>
      `);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-x-2 p-1 bg-gray-50 rounded shadow border border-gray-200 justify-between items-center w-full whitespace-nowrap">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Bold"
      >
        <FaBold className="w-3 h-3" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Italic"
      >
        <FaItalic className="w-3 h-3" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("strike") ? "bg-red-500 text-white" : "bg-white"} border border-gray-300 hover:bg-red-100 transition-all text-xs`}
        title="Strikethrough"
      >
        <FaStrikethrough className="w-3 h-3" />
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${!editor.can().undo() ? "bg-gray-300 cursor-not-allowed" : "bg-white"} border border-gray-300 hover:bg-gray-200 transition-all text-xs`}
        title="Undo"
      >
        <FaUndo className="w-3 h-3" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${!editor.can().redo() ? "bg-gray-300 cursor-not-allowed" : "bg-white"} border border-gray-300 hover:bg-gray-200 transition-all text-xs`}
        title="Redo"
      >
        <FaRedo className="w-3 h-3" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Heading 1"
      >
        <span className="text-xs font-bold">H1</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Heading 2"
      >
        <span className="text-xs font-semibold">H2</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("heading", { level: 3 }) ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Heading 3"
      >
        <span className="text-xs font-normal">H3</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("bulletList") ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Bullet List"
      >
        <FaListUl className="w-3 h-3" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 px-3 min-w-[36px] flex-1 rounded ${editor.isActive("blockquote") ? "bg-blue-500 text-white" : "bg-white"} border border-gray-300 hover:bg-blue-100 transition-all text-xs`}
        title="Blockquote"
      >
        <FaQuoteLeft className="w-3 h-3" />
      </button>
    </div>
  );
}

export default EditorExtensions;
