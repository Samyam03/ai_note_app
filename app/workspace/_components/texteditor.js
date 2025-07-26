'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import React, { useEffect, useState } from 'react'
import EditorExtensions from './editorExtensions'
import { useQuery, useAction, useMutation } from 'convex/react'
import { getNotes } from '@/convex/notes'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { generateAIResponse } from '@/configs/aiModel'

function TextEditor({fileId}) {

  const notes = useQuery(api.notes.getNotes,{
    fileId:fileId
  })

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({
      placeholder: 'Ask your question here and get AI-powered responses...',
    })],
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none w-full p-2 text-slate-800 leading-relaxed text-sm',
      },
    },
    immediatelyRender: false,
  })

  const searchAI = useAction(api.myAction.search)
  const saveNotes = useMutation(api.notes.saveNotes)
  const { user } = useUser()
  const [question, setQuestion] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(()=>{
    editor && editor.commands.setContent(notes)
  },[editor&&notes])

  const handleAIQuestion = async (e) => {
    e.preventDefault()
    if (!editor || isGenerating) return
    if (!question.trim()) {
      toast.error("Please enter a question")
      return
    }
    
    // Start timing
    const startTime = performance.now()
    toast("AI is fetching the result")
    setIsGenerating(true)
    
    try {
      // Phase 1: Search for relevant context
      const searchStartTime = performance.now()
      const searchResult = await searchAI({
        query: question,
        fileId: fileId,
      })
      const searchEndTime = performance.now()
      const searchTime = ((searchEndTime - searchStartTime) / 1000).toFixed(2)
      
      const unformattedAnswer = JSON.parse(searchResult)
      // Optimized context building - limit content length for faster processing
      let context = unformattedAnswer?.slice(0, 2).map(item => item.pageContent).join("\n\n") || ""
      if (!context.trim()) {
        toast.error("No relevant context found for your query")
        return
      }
      
      // Phase 2: Generate AI response
      const aiStartTime = performance.now()
      const prompt = `Answer the question based on the context. Use HTML tags: <h3>, <p>, <ul>, <ol>, <li>, <strong>.\n\nIf question asks for specific format (e.g., "3 points", "list"), follow exactly.\n\nFor descriptive questions: provide comprehensive analysis with background, analysis, insights, and conclusion.\n\nFor direct questions: give concise 1-2 sentence answer.\n\nCONTEXT:\n${context}\n\nQUESTION: "${question}"\n\nRespond with HTML content only. No explanations.`;
      const response = await generateAIResponse(prompt)
      const aiEndTime = performance.now()
      const aiTime = ((aiEndTime - aiStartTime) / 1000).toFixed(2)
      
      // Calculate total time
      const totalTime = ((aiEndTime - startTime) / 1000).toFixed(2)
      
      // Show timing information in console only
      console.log(`⏱️ AI Response Timing:`)
      console.log(`   🔍 Search phase: ${searchTime}s`)
      console.log(`   🤖 AI generation: ${aiTime}s`)
      console.log(`   ⏱️ Total time: ${totalTime}s`)
      
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
        .trim()
      const formattedContent = `<div style=\"background-color: #eff6ff; border-radius: 0.5rem; margin: 1rem 0; border: 1px solid #bfdbfe; overflow: auto; width: 100%;\"><strong>QUESTION: ${question}</strong><div><strong>ANSWER:</strong> ${cleanedResponse}</div></div>`;
      // Optimized editor insertion - single chain operation
      editor.chain().focus().insertContent('<p></p><p></p>' + formattedContent).run()
      saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      setQuestion("")
    } catch (error) {
      console.error("AI generation failed:", error)
      toast.error("AI generation failed")
      editor.commands.insertContent(`
        <div style=\"background-color: #fee2e2; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border: 1px solid #fecaca;\">
          <p style=\"color: #b91c1c; font-weight: 500;\">Error: Could not generate AI response</p>
          <p style=\"color: #ef4444; font-size: 0.875rem;\">${error.message || "Please try again later"}</p>
        </div>
      `)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Card for warning, input, toolbar */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 mx-2 mt-4 mb-2 p-4 flex flex-col gap-3">
        {/* AI Question Input */}
        <form onSubmit={handleAIQuestion} className="flex items-center gap-2">
          <Input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your question for AI..."
            className="flex-1 h-8 text-xs px-2 py-1 bg-slate-50 border-slate-200"
            disabled={isGenerating}
          />
          <Button type="submit" size="sm" disabled={isGenerating} className="h-8 px-4 text-xs font-semibold rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-none hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
            {isGenerating ? 'Thinking...' : 'Ask AI'}
          </Button>
        </form>
        {/* Warning Message */}
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-3 py-2 rounded text-xs">
          <strong>Warning:</strong> Please refrain from asking about the entire PDF or large blocks of text at once, as this may result in copyright-protected content being returned.
        </div>
        {/* Divider */}
        <div className="border-t border-slate-200 my-1" />
        {/* Toolbar */}
        <div className="pt-1 pb-0">
          <EditorExtensions editor={editor} />
        </div>
      </div>
      {/* Editor Content */}
      <div className="flex-1 h-full min-h-0 overflow-hidden">
        <div className="flex-1 h-full min-h-0 flex flex-col">
          <EditorContent
            editor={editor}
            className="flex-1 h-full min-h-0 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl shadow-sm mx-2 mb-2 p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default TextEditor