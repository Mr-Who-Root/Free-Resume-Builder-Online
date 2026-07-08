import React from 'react';

/**
 * A simple, safe client-side Markdown parser for inline formatting:
 * - **bold**
 * - *italics*
 * - [link text](url)
 */
export function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Split the text by bold, italic, and markdown link markers
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return React.createElement(
        'strong',
        { key: index, className: 'font-semibold text-gray-900 dark:print:text-black print:text-black' },
        part.slice(2, -2)
      );
    }
    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*')) {
      return React.createElement(
        'em',
        { key: index, className: 'italic' },
        part.slice(1, -1)
      );
    }
    // Link: [label](url)
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return React.createElement(
          'a',
          {
            key: index,
            href: match[2],
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-blue-600 dark:text-blue-500 hover:underline print:text-inherit print:no-underline'
          },
          match[1]
        );
      }
    }
    // Plain text
    return part;
  });
}
