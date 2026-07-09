import React, { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '../types/resume';
import { FormPanel } from './FormPanel';
import { PreviewPanel } from './PreviewPanel';
import { AtsScanner } from './AtsScanner';
import { downloadPdf } from '../utils/pdf';
import { downloadDoc } from '../utils/doc';
import { SAMPLE_RESUME_DATA } from '../utils/storage';
import {
  Download,
  FileCode,
  Upload,
  RotateCcw,
  Sparkles,
  Settings,
  Briefcase,
  ChevronDown,
  Check,
} from 'lucide-react';

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
  { value: 'sans',  label: 'Inter (Sans-serif)' },
  { value: 'serif', label: 'Georgia (Serif)'     },
  { value: 'mono',  label: 'Roboto Mono (Mono)'  },
];

const fontSizeOptions = [
  { value: 'xs', label: 'XS – Compact'  },
  { value: 'sm', label: 'SM – Standard' },
  { value: 'md', label: 'MD – Medium'   },
  { value: 'lg', label: 'LG – Large'    },
];

const colorOptions = [
  { value: 'navy',     label: 'Navy Blue'     },
  { value: 'slate',    label: 'Slate Steel'   },
  { value: 'emerald',  label: 'Emerald'       },
  { value: 'indigo',   label: 'Royal Purple'  },
  { value: 'crimson',  label: 'Crimson Rose'  },
  { value: 'charcoal', label: 'Charcoal Dark' },
];

const marginOptions = [
  { value: 'small',  label: 'Tight Margins'    },
  { value: 'medium', label: 'Medium Margins'   },
  { value: 'large',  label: 'Spacious Margins' },
];

interface SelectOption { value: string; label: string; group?: string; }

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
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 hover:border-indigo-500/60 transition font-medium gap-1.5"
      >
        <span className="truncate min-w-0">{selected?.label ?? value}</span>
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
                        <span>{opt.label}</span>
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
                    <span>{opt.label}</span>
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStyleChange = (key: keyof ResumeData['styles'], value: string) => {
    onChange({ ...data, styles: { ...data.styles, [key]: value } });
  };

  const handlePdfDownload = () =>
    downloadPdf('resume-preview-root', `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);

  const handleDocDownload = () =>
    downloadDoc('resume-preview-root', `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.doc`);

  const handleJsonExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.name.replace(/\s+/g, '_')}_backup.json`;
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
        if (parsed?.personalInfo && parsed?.styles) onChange(parsed);
      } catch { /* ignore */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => setShowResetConfirm(true);

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">

      {/* Header */}
      <header className="shrink-0 bg-slate-900 border-b border-slate-800 z-50 px-4 md:px-6 py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
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
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Resume Form</span>
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'ats' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>ATS Scanner</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition"
            title="Import JSON backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />

          <button
            onClick={handleJsonExport}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition"
            title="Export as JSON backup"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-800/60 hover:text-rose-400 rounded-lg transition"
            title="Reset to sample template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center bg-indigo-600 rounded-lg overflow-hidden shadow-lg shadow-indigo-600/20">
            <button
              onClick={handlePdfDownload}
              className="flex items-center gap-1.5 px-3 py-2 hover:bg-indigo-700 text-white text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <div className="w-px h-6 bg-indigo-500/60" />
            <button
              onClick={handleDocDownload}
              className="px-3 py-2 hover:bg-indigo-700 text-white text-xs font-bold transition"
              title="Export as MS Word (.doc)"
            >
              Word
            </button>
          </div>
        </div>
      </header>

      {/* Style Settings Drawer */}
      {showStyleDrawer && (
        <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 animate-slideDown relative z-45">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Template (12 options)</label>
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
            : <AtsScanner resumeData={data} />
          }
        </div>

        {/* RIGHT: PDF Preview — PreviewPanel manages its own internal scroll */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950" style={{ minHeight: 0 }}>
          <PreviewPanel resumeData={data} />
        </div>

      </main>

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

    </div>
  );
};
