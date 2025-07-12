'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import React, { useEffect } from 'react'
import EditorExtensions from './editorExtensions'
import { useQuery } from 'convex/react'
import { getNotes } from '@/convex/notes'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'

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
        class: 'prose max-w-none focus:outline-none w-full p-6 text-slate-800 leading-relaxed',
      },
    },
  })

  useEffect(()=>{
    editor && editor.commands.setContent(notes)
  },[editor&&notes])

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
      {/* Toolbar */}
      <div className="p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <EditorExtensions editor={editor} />
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <EditorContent
            editor={editor}
            className="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-sm mx-4 mb-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )
}

export default TextEditor