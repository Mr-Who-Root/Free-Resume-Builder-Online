import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, Link } from 'lucide-react';

interface MarkdownTextareaProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  label?: string;
}

export const MarkdownTextarea: React.FC<MarkdownTextareaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  label
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit content size
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate correctly when shrinking
    textarea.style.height = 'auto';
    // Set to scrollHeight to wrap content perfectly
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [value]);

  const handleAction = (type: 'bold' | 'italic' | 'bullet' | 'link') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    let replacement = '';
    let selectionOffsetStart = 0;
    let selectionOffsetEnd = 0;

    // Check surrounding characters for toggle behavior
    const before2 = text.substring(start - 2, start);
    const after2 = text.substring(end, end + 2);
    const before1 = text.substring(start - 1, start);
    const after1 = text.substring(end, end + 1);

    if (type === 'bold') {
      // Toggle bold OFF if selection is surrounded by **
      if (before2 === '**' && after2 === '**') {
        const adjustedStart = start - 2;
        const adjustedEnd = end + 2;
        const innerText = text.substring(start, end);
        const updatedValue = text.substring(0, adjustedStart) + innerText + text.substring(adjustedEnd);
        onChange(updatedValue);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(adjustedStart, adjustedStart + innerText.length);
        }, 0);
        return;
      }
      
      if (selected) {
        // Toggle bold OFF if the selected string itself starts/ends with **
        if (selected.startsWith('**') && selected.endsWith('**')) {
          replacement = selected.slice(2, -2);
          selectionOffsetStart = start;
          selectionOffsetEnd = start + replacement.length;
        } else {
          replacement = `**${selected}**`;
          selectionOffsetStart = start;
          selectionOffsetEnd = start + replacement.length;
        }
      } else {
        replacement = '****';
        selectionOffsetStart = start + 2;
        selectionOffsetEnd = start + 2;
      }
    } else if (type === 'italic') {
      // Toggle italic OFF if selection is surrounded by * (and not **)
      if (before1 === '*' && after1 === '*' && before2 !== '**' && after2 !== '**') {
        const adjustedStart = start - 1;
        const adjustedEnd = end + 1;
        const innerText = text.substring(start, end);
        const updatedValue = text.substring(0, adjustedStart) + innerText + text.substring(adjustedEnd);
        onChange(updatedValue);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(adjustedStart, adjustedStart + innerText.length);
        }, 0);
        return;
      }

      if (selected) {
        // Toggle italic OFF if the selected string itself starts/ends with *
        if (selected.startsWith('*') && selected.endsWith('*') && !selected.startsWith('**')) {
          replacement = selected.slice(1, -1);
          selectionOffsetStart = start;
          selectionOffsetEnd = start + replacement.length;
        } else {
          replacement = `*${selected}*`;
          selectionOffsetStart = start;
          selectionOffsetEnd = start + replacement.length;
        }
      } else {
        replacement = '**';
        selectionOffsetStart = start + 1;
        selectionOffsetEnd = start + 1;
      }
    } else if (type === 'bullet') {
      const beforeText = text.substring(0, start);
      const needsNewline = beforeText.length > 0 && !beforeText.endsWith('\n');
      
      if (selected) {
        const lines = selected.split('\n');
        replacement = lines
          .map(line => line.startsWith('- ') ? line : `- ${line}`)
          .join('\n');
        if (needsNewline) {
          replacement = '\n' + replacement;
        }
        selectionOffsetStart = start;
        selectionOffsetEnd = start + replacement.length;
      } else {
        replacement = needsNewline ? '\n- ' : '- ';
        selectionOffsetStart = start + replacement.length;
        selectionOffsetEnd = start + replacement.length;
      }
    } else if (type === 'link') {
      if (selected) {
        replacement = `[${selected}](https://)`;
        selectionOffsetStart = start + selected.length + 3;
        selectionOffsetEnd = start + selected.length + 11;
      } else {
        replacement = '[](https://)';
        selectionOffsetStart = start + 1;
        selectionOffsetEnd = start + 1;
      }
    }

    // Apply standard updates if not already returned by short-circuit toggle
    if (replacement) {
      const updatedValue = text.substring(0, start) + replacement + text.substring(end);
      onChange(updatedValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(selectionOffsetStart, selectionOffsetEnd);
      }, 0);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs text-slate-400 font-semibold block">
          {label}
        </label>
      )}
      <div className="border border-slate-800 rounded-lg bg-slate-950 overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
        {/* Editor Toolbar */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/60 border-b border-slate-850 text-slate-400">
          <button
            type="button"
            onClick={() => handleAction('bold')}
            className="p-1 hover:bg-slate-800 hover:text-slate-200 rounded transition"
            title="Make Text Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAction('italic')}
            className="p-1 hover:bg-slate-800 hover:text-slate-200 rounded transition"
            title="Italicize Text"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAction('bullet')}
            className="p-1 hover:bg-slate-800 hover:text-slate-200 rounded transition"
            title="Add Bullet List Item"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAction('link')}
            className="p-1 hover:bg-slate-800 hover:text-slate-200 rounded transition"
            title="Insert Markdown Link"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider ml-auto select-none mr-1.5">
            Editor
          </span>
        </div>

        {/* Text Area */}
        <textarea
          id={id}
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-sm bg-transparent border-none p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none resize-none overflow-hidden ${className}`}
        />
      </div>
    </div>
  );
};
