import { api } from '@/convex/_generated/api';
import React from 'react'
import { FaBold, FaItalic, FaStrikethrough, FaUndo, FaRedo, FaQuoteLeft, FaListUl, FaHeading, FaMagic } from 'react-icons/fa';
import { useAction } from 'convex/react';
import { useParams } from 'next/navigation';


function EditorExtensions({ editor}) {
  const {fileId} = useParams();
  const searchAI = useAction(api.myAction.search);

  const onAIClick = async() => {
    // Placeholder for AI functionality
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
    console.log('Selected text:', selectedText);

    const result = await searchAI({
      query: selectedText,
      fileId: fileId
    })

    console.log("Result from AI: ", result)

    
  };
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

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-md ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <span className="text-sm font-bold">H1</span>
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <span className="text-sm font-semibold">H2</span>
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-md ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white'} border-2 border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
      >
        <span className="text-sm font-normal">H3</span>
      </button>

      {/* Sparkles Button */}
      <button
        onClick={() => onAIClick()}
        className="p-2 rounded-md bg-white border-2 border-gray-300 hover:bg-purple-100 hover:shadow-sm transition-all"
      >
        <FaMagic className="w-4 h-4 text-purple-500" />
      </button>

    </div>
  );
}

export default EditorExtensions;
