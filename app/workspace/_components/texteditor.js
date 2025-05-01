'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import React from 'react'
import EditorExtensions from './editorExtensions'

function TextEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({
      placeholder: 'Write something …',
    })],
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none w-full p-4',
      },
    },
  })

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-2 border-b border-gray-300">
        <EditorExtensions editor={editor} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <EditorContent
            editor={editor}
            className="flex-1 overflow-y-auto border border-gray-300 rounded-lg shadow-sm bg-white mx-4 mb-4"
          />
        </div>
      </div>
    </div>
  )
}

export default TextEditor