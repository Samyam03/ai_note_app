import React from 'react';

function PdfViewer({ fileUrl }) {

  return (
    <div className="flex flex-1 h-full min-h-0 w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-1 h-full min-h-0 w-full bg-white rounded shadow overflow-hidden border border-slate-200">
        <iframe
          src={fileUrl + '#toolbar=0'}
          className="flex-1 h-full min-h-0 w-full border-none"
          style={{ minHeight: 0, height: '100%', width: '100%' }}
          title="Document Viewer"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default PdfViewer;