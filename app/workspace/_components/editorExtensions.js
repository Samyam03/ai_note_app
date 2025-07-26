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

      // Optimized context building - limit content length for faster processing
      const unformattedAnswer = JSON.parse(searchResult);
      let context = unformattedAnswer?.slice(0, 2).map(item => item.pageContent).join("\n\n") || "";

      if (!context.trim()) {
        toast.error("No relevant context found for your query");
        return;
      }

      // Optimized prompt for faster AI processing
      const prompt = `Answer the question based on the context. Use HTML tags: <h3>, <p>, <ul>, <ol>, <li>, <strong>.\n\nIf question asks for specific format (e.g., "3 points", "list"), follow exactly.\n\nFor descriptive questions: provide comprehensive analysis with background, analysis, insights, and conclusion.\n\nFor direct questions: give concise 1-2 sentence answer.\n\nCONTEXT:\n${context}\n\nQUESTION: "${selectedText}"\n\nRespond with HTML content only. No explanations.`;

      const response = await generateAIResponse(prompt);

      // Optimized response cleaning - single pass with combined regex
      let cleanedResponse = response
        .replace(/```html|```|^"+|"+$|\\n|\\"/g, (match) => {
          if (match === '```html' || match === '```') return '';
          if (match === '^"+' || match === '"+$') return '';
          if (match === '\\n') return '\n';
          if (match === '\\"') return '"';
          return match;
        })
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
