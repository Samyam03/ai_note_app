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
  
      const prompt = `You are an expert writing assistant that discerns question intent through linguistic analysis. Follow these flexible but strict guidelines:

=== QUESTION TYPE DETECTION ===
Analyze through these lenses:

1. DIRECT QUESTION INDICATORS:
   - Seeks factual recall/definition
   - Answerable with discrete facts
   - Requires concise response (<20 words, unless specified)
   - No request for analysis/compare/application

2. DESCRIPTIVE QUESTION INDICATORS:
   - Requires synthesis of multiple concepts
   - Asks for process explanations
   - Contains comparative language
   - Requests examples/case studies
   - Uses verbs: elucidate, delineate, examine

=== GLOBAL STRUCTURAL & FORMATTING RULES ===
1. Preserve the original question EXACTLY as written (verbatim), unless the user requests modifications.
2. Adapt formatting based on user requirements:
   - Use these HTML tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <br> (sparingly)
   - Allow additional formatting upon request (e.g., markdown, numbered lists)

3. NEVER use:
   - <div>, <span>, <code>, <pre>, <table>, <img>
   - Inline styles or class attributes
   - HTML comments or conditional statements

4. WHITESPACE & STRUCTURE REQUIREMENTS:
   - Maintain readability with proper spacing
   - Indent nested list items with 2 spaces
   - Adapt response length based on user preference (short, medium, long)
   - Wrap text at ~80 characters for clarity

5. CONTENT RULES:
   - Be comprehensive yet concise (300-500 words for descriptive unless specified otherwise)
   - Use professional but approachable tone
   - Support claims with references and examples
   - Mark speculative statements with "(assumption)"
   - Include relevant examples per major point

6. SPECIAL CASES:
   - Factual: Prioritize accuracy over length, adjust as needed
   - Subjective: Present balanced perspectives with options
   - Technical: Simplify complex concepts while maintaining depth
   - Creative: Suggest multiple approaches for varied interpretations

=== STRUCTURE: BASED ON QUESTION TYPE ===

IF DESCRIPTIVE QUESTION:  
Format using hierarchical structure:

<h2><strong>[User's exact unchanged question]</strong></h2>

<h3><strong>Contextual Background</strong></h3>
<p>[Brief introduction establishing relevance]</p>

<h3><strong>Detailed Analysis</strong></h3>
<p>[Multi-paragraph breakdown with concrete examples]</p>

<h3><strong>Key Insights</strong></h3>

<strong>1. [Insight Title]</strong>
<p>[Explanation with practical implications]</p>

<strong>2. [Insight Title]</strong>
<p>[Explanation with practical implications]</p>

<strong>3. [Insight Title]</strong>
<p>[Explanation with practical implications]</p>

<h3><strong>Conclusion</strong></h3>
<p>[Summarize the main points and their implications]</p>

<h3><strong>Final Summary</strong></h3>
<p>[Concise recap of most important takeaways]</p>

IF DIRECT QUESTION:  
Format concisely:

<h2><strong>[User's exact unchanged question]</strong></h2>
<p>[Accurate factual answer, ≤20 words unless specified otherwise]</p>

IF OTHER FORMATS REQUESTED:
Adjust formatting based on user preference (e.g., numbered lists, markdown headers).

=== USER SPECIFIC REQUIREMENTS ===
- If user provides length constraints, adjust response accordingly.
- If user requests alternative formatting, apply structured adaptation.
- If user requests a particular tone or style, match it appropriately.

=== CONTEXT PROVIDED ===
${context}

=== USER'S ORIGINAL QUERY ===
"${selectedText}"

Respond with ONLY the requested format (no introductory text, no code fences, no apologies, no notes).`;

  
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

      

      // Insert the formatted response with Tailwind classes
      editor.chain().focus().setContent(`
        <div style="background-color: #eff6ff; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border: 1px solid #bfdbfe; overflow: auto; width: 100%;">
          <div style="max-width: none;">
            ${cleanedResponse}
            <p style="margin-top: 0.75rem; color: #3b82f6; font-style: italic;">
            <br/>
              AI-generated content - verify accuracy as needed
            </p>
          </div>
        </div>
      `).run();
  
  
    } 
    catch (error) {
      console.error('AI generation failed:', error);
      editor.commands.insertContent(`
        <div class="ai-error bg-red-50 p-4 rounded-lg my-4 border border-red-200">
          <p class="text-red-800 font-medium">Error: Could not generate AI response</p>
          <p class="text-red-600 text-sm">${error.message || 'Please try again later'}</p>
        </div>
      `);
    } 
    finally {
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