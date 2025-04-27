import React from 'react'
import { FaBold, FaItalic, FaStrikethrough, FaUndo, FaRedo, FaQuoteLeft, FaListUl, FaHeading } from 'react-icons/fa';

function EditorExtensions({ editor }) {
  return (
    <div className="flex gap-4 p-3 bg-gray-50 rounded-lg shadow-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <FaBold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <FaItalic className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded-md ${editor.isActive('strike') ? 'bg-red-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-red-100 hover:shadow-sm transition-all`}
      >
        <FaStrikethrough className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-2 rounded-md ${!editor.can().undo() ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'} border-2 border-gray-300 hover:bg-gray-200 hover:shadow-sm transition-all`}
      >
        <FaUndo className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-2 rounded-md ${!editor.can().redo() ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'} border-2 border-gray-300 hover:bg-gray-200 hover:shadow-sm transition-all`}
      >
        <FaRedo className="w-4 h-4" />
      </button>

      {/* Heading 1 Button */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-md ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <span className="text-sm font-bold">H1</span>
      </button>
      
      {/* Heading 2 Button */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <span className="text-sm font-semibold">H2</span>
      </button>
      
      {/* Heading 3 Button */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-md ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <span className="text-sm font-normal">H3</span>
      </button>
    </div>
  );
}

export default EditorExtensions;