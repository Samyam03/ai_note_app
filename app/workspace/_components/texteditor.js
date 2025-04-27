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
        class: 'focus:outline-none h-screen w-full p-4 border border-gray-300 rounded-lg shadow-sm',
      },
    },
    // Disable immediate rendering
    immediatelyRender: false,
  })

  if (!editor) {
    return <div>Loading...</div> // Show loading until editor is initialized
  }

  return (
    <div>
      <EditorExtensions editor={editor} />
      <div>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor