import React from 'react';

function PdfViewer({ fileUrl }) {
  console.log("THIS IS FILE"+fileUrl)
  return (
    <div className="w-full h-screen bg-gray-100">
        
      <iframe
      
        src={fileUrl + '#toolbar=0'}
        className="w-full h-full border-none"
        title="PDF Viewer"
      >
      </iframe>
    </div>
  );
}

export default PdfViewer;