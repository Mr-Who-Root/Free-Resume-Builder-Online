import React, { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '../types/resume';
import { FormPanel } from './FormPanel';
import { PreviewPanel } from './PreviewPanel';
import { AtsScanner } from './AtsScanner';
import { downloadPdf } from '../utils/pdf';
import { SAMPLE_RESUME_DATA } from '../utils/storage';

import {
  Download,
  RotateCcw,
  Sparkles,
  Settings,
  Briefcase,
  ChevronDown,
  Check,
  Upload,
  FileJson
} from 'lucide-react';

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={props.style}
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);


const templateOptions = [
  { value: 'tech-classic',    label: 'SV Classic (Silicon Valley)',     group: 'De Facto Tech Standard' },
  { value: 'tech-compact',    label: 'Compact Tech (High Density)',      group: 'De Facto Tech Standard' },
  { value: 'tech-academic',   label: 'Academic Slate (Times New Roman)', group: 'De Facto Tech Standard' },
  { value: 'exec-classic',    label: 'Classic Serif (Georgia)',          group: 'Minimalist Executive'   },
  { value: 'exec-modern',     label: 'Ultra Modern Minimalist',          group: 'Minimalist Executive'   },
  { value: 'exec-editorial',  label: 'Editorial Serif (Lora)',           group: 'Minimalist Executive'   },
  { value: 'split-left',      label: 'Left Sidebar Tech (Dark)',         group: 'Modern Split'           },
  { value: 'split-right',     label: 'Right Sidebar Professional',       group: 'Modern Split'           },
  { value: 'split-compact',   label: 'Dual Column Compact',              group: 'Modern Split'           },
  { value: 'creative-accent', label: 'Slate & Accent (Pill tags)',       group: 'Creative Tech / UI-UX'  },
  { value: 'creative-top',    label: 'Dark Block Banner',                group: 'Creative Tech / UI-UX'  },
  { value: 'creative-grid',   label: 'Structured Bordered Grid',         group: 'Creative Tech / UI-UX'  },
];

const fontOptions = [
  { value: 'inter',       label: 'Inter (Modern & Clean)'       },
  { value: 'outfit',      label: 'Outfit (Elegant & Geometric)' },
  { value: 'roboto',      label: 'Roboto (Standard & Clean)'    },
  { value: 'lora',        label: 'Lora (Classic Editorial)'     },
  { value: 'playfair',    label: 'Playfair Display (Premium)'   },
  { value: 'robotomono',  label: 'Roboto Mono (Tech & Clean)'   },
];

const fontSizeOptions = [
  { value: 'xs', label: 'XS – Compact'  },
  { value: 'sm', label: 'SM – Standard' },
  { value: 'md', label: 'MD – Medium'   },
  { value: 'lg', label: 'LG – Large'    },
];

const colorOptions = [
  { value: 'navy',     label: 'Navy Blue',     color: '#1e3a8a' },
  { value: 'slate',    label: 'Slate Steel',   color: '#475569' },
  { value: 'emerald',  label: 'Emerald',       color: '#065f46' },
  { value: 'indigo',   label: 'Royal Purple',  color: '#4f46e5' },
  { value: 'crimson',  label: 'Crimson Rose',  color: '#b91c1c' },
  { value: 'charcoal', label: 'Charcoal Dark', color: '#1f2937' },
  { value: 'teal',     label: 'Teal Forest',   color: '#0f766e' },
  { value: 'amber',    label: 'Amber Gold',    color: '#b45309' },
  { value: 'rose',     label: 'Rose Petal',    color: '#be123c' },
  { value: 'violet',   label: 'Violet Dusk',   color: '#6d28d9' },
];

const marginOptions = [
  { value: 'small',  label: 'Tight Margins'    },
  { value: 'medium', label: 'Medium Margins'   },
  { value: 'large',  label: 'Spacious Margins' },
];

interface SelectOption {
  value: string;
  label: string;
  group?: string;
  color?: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  grouped?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, grouped }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [open]);

  const selected = options.find(o => o.value === value);

  const groups: Record<string, SelectOption[]> = {};
  if (grouped) {
    options.forEach(opt => {
      const g = opt.group ?? '';
      if (!groups[g]) groups[g] = [];
      groups[g].push(opt);
    });
  }

  return (
    <div className="relative w-full" ref={containerRef} style={{ zIndex: open ? 50 : undefined }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 hover:border-indigo-500/60 transition font-medium gap-1.5"
      >
        <span className="truncate min-w-0 flex items-center gap-2">
          {selected?.color && (
            <span 
              className="w-3 h-3 rounded-full shrink-0 border border-slate-800/60" 
              style={{ backgroundColor: selected.color }} 
            />
          )}
          <span>{selected?.label ?? value}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-y-auto custom-scrollbar z-50 animate-slideDown"
          style={{ maxHeight: '260px' }}
        >
          <div className="p-1.5">
            {grouped
              ? Object.entries(groups).map(([groupName, opts]) => (
                  <div key={groupName} className="mb-1">
                    {groupName && (
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest px-2.5 pt-2 pb-1 select-none">
                        {groupName}
                      </div>
                    )}
                    {opts.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { onChange(opt.value); setOpen(false); }}
                        className={`w-full text-left text-xs flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                          opt.value === value
                            ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {opt.color && (
                            <span 
                              className="w-3 h-3 rounded-full shrink-0 border border-slate-750" 
                              style={{ backgroundColor: opt.color }} 
                            />
                          )}
                          <span>{opt.label}</span>
                        </span>
                        {opt.value === value && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                ))
              : options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full text-left text-xs flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                      opt.value === value
                        ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {opt.color && (
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 border border-slate-750" 
                          style={{ backgroundColor: opt.color }} 
                        />
                      )}
                      <span>{opt.label}</span>
                    </span>
                    {opt.value === value && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                  </button>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

interface LayoutProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const Layout: React.FC<LayoutProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'ats'>('editor');
  const [showStyleDrawer, setShowStyleDrawer] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const pageSize = 'a4';
  const [jobDescription, setJobDescription] = useState('');
  const [showStarPrompt, setShowStarPrompt] = useState<{ type: 'pdf' | 'doc' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJsonExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.name.trim().replace(/\s+/g, '_') || 'resume'}_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed?.personalInfo && parsed?.styles) {
          onChange(parsed);
        }
      } catch { /* ignore */ }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow selecting same file again
  };

  const handleStyleChange = (key: keyof ResumeData['styles'], value: string) => {
    onChange({ ...data, styles: { ...data.styles, [key]: value } });
  };

  const handlePdfDownloadActual = () =>
    downloadPdf('resume-preview-root', `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`, pageSize);

  const handlePdfDownload = () => setShowStarPrompt({ type: 'pdf' });

  const handleResetData = () => setShowResetConfirm(true);

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">

      {/* Header */}
      <header className="shrink-0 bg-slate-900 border-b border-slate-800 z-[100] px-4 md:px-6 py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/35">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-white leading-none">ResumeCraft</h1>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Premium Client-Side Editor</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <div className="relative group">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'editor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Resume Form</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Open the inputs and section fields editor form
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={() => setActiveTab('ats')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'ats' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>ATS Scanner</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Analyze your resume match against a job description locally
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <button
              onClick={() => setShowStyleDrawer(!showStyleDrawer)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 border rounded-lg transition ${
                showStyleDrawer
                  ? 'bg-indigo-950 border-indigo-600 text-indigo-400'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Style Settings</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Customize font styling, templates, margins, and theme accent colors
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition hover:text-indigo-400"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import JSON</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Restore data from a previously exported JSON backup file
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={handleJsonExport}
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition hover:text-indigo-400"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Export your resume configuration as a JSON backup file for future edits
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={handleResetData}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-800/60 hover:text-rose-400 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Reset editor content to default developer sample template data
            </div>
          </div>

          <div className="relative group">
            <a
              href="https://github.com/Mr-Who-Root/Free-Resume-Builder-Online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-750 text-slate-300 rounded-lg transition hover:text-indigo-400"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
              Visit the open-source code repository of this project on GitHub
            </div>
          </div>

          <div className="flex items-center bg-indigo-600 rounded-lg overflow-hidden shadow-lg shadow-indigo-600/20">
            <div className="relative group">
              <button
                onClick={handlePdfDownload}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-indigo-700 text-white text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 whitespace-nowrap z-[110] font-normal">
                Download resume as print-ready PDF vector file
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Style Settings Drawer */}
      {showStyleDrawer && (
        <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 animate-slideDown relative z-[90]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Template</label>
              <CustomSelect
                value={data.styles.templateId}
                options={templateOptions}
                onChange={v => handleStyleChange('templateId', v)}
                grouped
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Typography</label>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect value={data.styles.fontFamily} options={fontOptions} onChange={v => handleStyleChange('fontFamily', v)} />
                <CustomSelect value={data.styles.fontSize} options={fontSizeOptions} onChange={v => handleStyleChange('fontSize', v)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Accent & Layout</label>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect value={data.styles.colorTheme} options={colorOptions} onChange={v => handleStyleChange('colorTheme', v)} />
                <CustomSelect value={data.styles.margin} options={marginOptions} onChange={v => handleStyleChange('margin', v)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main workspace: flex-row on desktop, each column scrolls independently */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

        {/* LEFT: Editor form / ATS Scanner — scrolls independently */}
        <div
          className="lg:w-5/12 w-full border-r border-slate-900 overflow-y-auto p-5 bg-slate-950/65 custom-scrollbar"
          style={{ minHeight: 0 }}
        >
          {activeTab === 'editor'
            ? <FormPanel data={data} onChange={onChange} />
            : <AtsScanner 
                resumeData={data} 
                jobDescription={jobDescription} 
                onJobDescriptionChange={setJobDescription} 
              />
          }
        </div>

        {/* RIGHT: PDF Preview — PreviewPanel manages its own internal scroll */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950" style={{ minHeight: 0 }}>
          <PreviewPanel 
            resumeData={data} 
            pageSize={pageSize} 
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-slate-900 border-t border-slate-800 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 z-40">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Mr-Who-Root/Free-Resume-Builder-Online"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-400 transition"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
        </div>
        <div>
          Made with ❤️ by{' '}
          <a
            href="https://github.com/Mr-Who-Root"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 font-semibold transition"
          >
            Mr-Who
          </a>
        </div>
      </footer>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slideDown">
            <h3 className="text-base font-bold text-white mb-2">Reset Resume Data?</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              This will wipe all your edits and restore the default developer sample template. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { onChange(SAMPLE_RESUME_DATA); setShowResetConfirm(false); }}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Star Prompt modal alert */}
      {showStarPrompt && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slideDown space-y-4">
            <div className="flex items-center gap-2.5 text-yellow-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="text-base font-bold text-white">Give us a Star on GitHub! ⭐</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you find this Resume Builder helpful, please give our repository a star! It helps other developers discover this project and supports further open-source tools.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
              <div className="font-medium text-slate-300">Mr-Who-Root/Free-Resume-Builder-Online</div>
              <a
                href="https://github.com/Mr-Who-Root/Free-Resume-Builder-Online"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-semibold transition flex items-center gap-1 shadow shadow-indigo-600/30"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Give Star ⭐</span>
              </a>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowStarPrompt(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePdfDownloadActual();
                  setShowStarPrompt(null);
                }}
                className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
