import React, { useState } from 'react';
import type { ResumeData } from '../types/resume';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ZoomIn, ZoomOut, RotateCcw, FileText } from 'lucide-react';

interface PreviewPanelProps {
  resumeData: ResumeData;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ resumeData }) => {
  const [scale, setScale] = useState(0.85); // Default zoom level for comfortable dashboard preview
  const [pageSize, setPageSize] = useState<'letter' | 'a4'>('letter');

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.05, 1.3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.05, 0.55));
  };

  const handleResetZoom = () => {
    setScale(0.85);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 shadow-2xl relative">
      
      {/* Zoom and Page controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-4 py-3 border-b border-slate-800 text-slate-300">
        
        {/* Paper Size selector */}
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paper Standard</span>
          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800/80 flex text-xs font-medium">
            <button
              onClick={() => setPageSize('letter')}
              className={`px-2 py-1 rounded-md transition ${pageSize === 'letter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Letter (US)
            </button>
            <button
              onClick={() => setPageSize('a4')}
              className={`px-2 py-1 rounded-md transition ${pageSize === 'a4' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              A4 (MNC Standard)
            </button>
          </div>
        </div>

        {/* Zoom Controller */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.55}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 hover:bg-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold px-2 font-mono w-12 text-center text-slate-400">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 1.3}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 hover:bg-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 ml-1 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-700 hover:bg-slate-900 transition text-slate-400 hover:text-indigo-400"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main scrolling viewport */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6 flex justify-center items-start custom-scrollbar">
        
        {/* Mathematically scaled wrapper to let the parent viewport scrollbar compute correctly */}
        <div 
          style={{ 
            width: `${(pageSize === 'letter' ? 816 : 794) * scale}px`, 
            height: `${(pageSize === 'letter' ? 1056 : 1123) * scale}px`,
            position: 'relative'
          }}
          className="shrink-0 mb-10"
        >
          <div 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top left',
              width: `${pageSize === 'letter' ? 816 : 794}px`,
              height: `${pageSize === 'letter' ? 1056 : 1123}px`,
              position: 'absolute',
              left: 0,
              top: 0
            }}
            className="transition-transform duration-100 ease-out shrink-0"
          >
            <div 
              id="resume-preview-root"
              className="w-full h-full bg-white shadow-2xl rounded-sm text-gray-900 select-text overflow-hidden"
            >
              <TemplateRenderer data={resumeData} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
