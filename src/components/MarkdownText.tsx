import React from 'react';
import { parseMarkdown } from '../utils/parser';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split into lines to respect line breaks as paragraphs or line break elements
  const lines = text.split('\n');

  return (
    <div className={`space-y-1 ${className}`}>
      {lines.map((line, idx) => {
        // If line starts with bullet characters, we render standard margin spacing
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const cleanLine = isBullet 
          ? line.trim().replace(/^[•-]\s*/, '') 
          : line;

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1">
              <span className="select-none print:text-black">•</span>
              <span className="flex-1">{parseMarkdown(cleanLine)}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseMarkdown(cleanLine)}
          </p>
        );
      })}
    </div>
  );
};
