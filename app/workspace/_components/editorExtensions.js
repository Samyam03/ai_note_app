import { api } from '@/convex/_generated/api';
import React, { useState } from 'react';
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
  FaSpinner
} from 'react-icons/fa';
import { useAction } from 'convex/react';
import { useParams } from 'next/navigation';
import { generateAIResponse } from '@/configs/aiModel';

function EditorExtensions({ editor }) {
  const { fileId } = useParams();
  const searchAI = useAction(api.myAction.search);
  const [isGenerating, setIsGenerating] = useState(false);

  const onAIClick = async () => {
    if (!editor || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const { from, to } = editor.state.selection;
      const hasSelection = !editor.state.selection.empty;
      const selectedText = hasSelection
        ? editor.state.doc.textBetween(from, to, ' ')
        : editor.getText();
  
      if (!selectedText.trim()) {
        alert('Please select some text or add content to your document');
        return;
      }
  
      const searchResult = await searchAI({
        query: selectedText,
        fileId: fileId
      });
  
      const unformattedAnswer = JSON.parse(searchResult);
      let context = "";
      unformattedAnswer?.forEach(item => {
        context += item.pageContent + "\n\n";
      });
  
      if (!context.trim()) {
        alert('No relevant context found for your query');
        return;
      }
  
      const prompt = `
You are a professional writing assistant. Generate a response with:

1. PRESERVE the original question exactly as written
2. Use ONLY these HTML tags: <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>
3. Follow this EXACT structure:
   <h3>Original Question</h3>
   <p>[User's exact question]</p>
   
   <h3>Comprehensive Analysis</h3>
   <p>[Detailed analysis with examples]</p>
   
   <h3>Key Takeaways</h3>
   <ul>
     <li><strong>Point 1</strong>: Explanation</li>
     <li><strong>Point 2</strong>: Explanation</li>
   </ul>
   
   <h3>Actionable Advice</h3>
   <p>[Practical steps to implement]</p>

4. Never use: <div>, <span>, <code>, or other complex HTML
5. Maintain perfect spacing (single line between elements)
6. Keep responses concise but thorough

CONTEXT:
${context}

USER'S QUESTION:
"${selectedText}"

Respond with ONLY the formatted HTML content:`;
  
      const response = await generateAIResponse(prompt);
      
      // Improved cleaning and trimming
      let cleanedResponse = response
        .replace(/```html|```/g, '')
        .replace(/^"+|"+$/g, '')
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/^\s+|\s+$/g, '')
        .replace(/(<[^>]+>)\s+/g, '$1')
        .replace(/\s+(<\/[^>]+>)/g, '$1')
        .trim();

      // Parse and sanitize HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanedResponse;
      
      const allowedTags = ['H3', 'P', 'UL', 'OL', 'LI', 'STRONG', 'EM', 'BR'];
      const elementsToRemove = [];
      
      tempDiv.querySelectorAll('*').forEach(element => {
        if (!allowedTags.includes(element.tagName)) {
          elementsToRemove.push(element);
        }
      });
      
      elementsToRemove.forEach(element => {
        const parent = element.parentNode;
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      });
  
      cleanedResponse = tempDiv.innerHTML;

      // Insert the formatted response with Tailwind classes
      editor.commands.insertContent(`
        <div class="ai-response bg-blue-50 p-4 rounded-lg my-4 border border-blue-200 overflow-auto w-full">
          <div class="prose max-w-none">${cleanedResponse}
            <p class="mt-3 text-xs text-blue-500 italic">AI-generated content - verify accuracy as needed</p>
          </div>
        </div>
        <p class="py-1"></p>
      `);
  
      if (hasSelection) {
        const endPos = editor.state.selection.to;
        editor.commands.setTextSelection(endPos + 1);
      }
  
    } catch (error) {
      console.error('AI generation failed:', error);
      editor.commands.insertContent(`
        <div class="ai-error bg-red-50 p-4 rounded-lg my-4 border border-red-200">
          <p class="text-red-800 font-medium">Error: Could not generate AI response</p>
          <p class="text-red-600 text-sm">${error.message || 'Please try again later'}</p>
        </div>
      `);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg shadow-lg border border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-3 rounded-md ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Bold"
      >
        <FaBold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-3 rounded-md ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Italic"
      >
        <FaItalic className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-3 rounded-md ${editor.isActive('strike') ? 'bg-red-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-red-100 hover:shadow-sm transition-all`}
        title="Strikethrough"
      >
        <FaStrikethrough className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-3 rounded-md ${!editor.can().undo() ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'} border border-gray-300 hover:bg-gray-200 hover:shadow-sm transition-all`}
        title="Undo"
      >
        <FaUndo className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-3 rounded-md ${!editor.can().redo() ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'} border border-gray-300 hover:bg-gray-200 hover:shadow-sm transition-all`}
        title="Redo"
      >
        <FaRedo className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-3 rounded-md ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Heading 1"
      >
        <span className="text-sm font-bold">H1</span>
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-3 rounded-md ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Heading 2"
      >
        <span className="text-sm font-semibold">H2</span>
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-3 rounded-md ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Heading 3"
      >
        <span className="text-sm font-normal">H3</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-3 rounded-md ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Bullet List"
      >
        <FaListUl className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-3 rounded-md ${editor.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-white'} border border-gray-300 hover:bg-blue-100 hover:shadow-sm transition-all`}
        title="Blockquote"
      >
        <FaQuoteLeft className="w-4 h-4" />
      </button>

      <button
        onClick={onAIClick}
        disabled={isGenerating}
        className={`p-3 rounded-md ${isGenerating ? 'bg-purple-300' : 'bg-white'} border border-gray-300 hover:bg-purple-100 hover:shadow-sm transition-all`}
        title="AI Assist"
      >
        {isGenerating ? (
          <FaSpinner className="w-4 h-4 text-purple-500 animate-spin" />
        ) : (
          <FaMagic className="w-4 h-4 text-purple-500" />
        )}
      </button>
    </div>
  );
}

export default EditorExtensions;