import React from 'react';

function PdfViewer({ fileUrl }) {

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
        <iframe
          src={fileUrl + '#toolbar=0'}
          className="w-full h-full border-none"
          title="PDF Viewer"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default PdfViewer;