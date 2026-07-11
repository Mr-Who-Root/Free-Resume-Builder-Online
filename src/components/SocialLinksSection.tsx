import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SocialLink, SocialPlatform } from '../types/resume';
import { SOCIAL_PLATFORMS, SOCIAL_ICONS } from '../utils/socialLinks';

interface Props {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

const PLATFORM_ORDER: SocialPlatform[] = [
  'linkedin', 'github', 'instagram', 'youtube', 'facebook',
  'twitter', 'tiktok', 'behance', 'dribbble', 'medium', 'stackoverflow', 'other',
];

const SocialIcon: React.FC<{ platform: SocialPlatform; size?: number }> = ({ platform, size = 14 }) => {
  const { viewBox, paths } = SOCIAL_ICONS[platform];
  return (
    <svg viewBox={viewBox} width={size} height={size} fill="currentColor" className="shrink-0">
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
    </svg>
  );
};

export const SocialLinksSection: React.FC<Props> = ({ links, onChange }) => {
  const addLink = () => {
    // Find first platform not already added
    const used = new Set(links.map(l => l.platform));
    const next = PLATFORM_ORDER.find(p => !used.has(p)) || 'other';
    onChange([...links, { platform: next, username: '' }]);
  };

  const updateLink = (idx: number, patch: Partial<SocialLink>) => {
    const updated = links.map((l, i) => i === idx ? { ...l, ...patch } : l);
    onChange(updated);
  };

  const removeLink = (idx: number) => {
    onChange(links.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-800/80">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Social Links</span>
        <button
          type="button"
          onClick={addLink}
          className="flex items-center gap-1 text-[10px] bg-indigo-950 border border-indigo-900/60 hover:bg-indigo-900/40 text-indigo-400 px-2 py-1 rounded-md transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add Platform</span>
        </button>
      </div>

      {links.length === 0 && (
        <p className="text-[10px] text-slate-600 italic">No social links added yet. Click "Add Platform" to get started.</p>
      )}

      {links.map((link, idx) => {
        const meta = SOCIAL_PLATFORMS[link.platform];
        return (
          <div key={idx} className="flex gap-2 items-start bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-lg animate-fadeIn">
            {/* Platform select */}
            <div className="w-32 space-y-1 shrink-0">
              <label className="text-[10px] text-slate-500 font-semibold uppercase block">Platform</label>
              <div className="relative">
                {/* icon preview */}
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: meta.color }}
                >
                  <SocialIcon platform={link.platform} size={12} />
                </span>
                <select
                  value={link.platform}
                  onChange={(e) => updateLink(idx, { platform: e.target.value as SocialPlatform })}
                  className="w-full text-[11px] bg-slate-950 border border-slate-800 rounded p-1.5 pl-7 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                >
                  {PLATFORM_ORDER.map(p => (
                    <option key={p} value={p}>{SOCIAL_PLATFORMS[p].label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Username */}
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 font-semibold uppercase block">
                Username
                <span className="text-slate-600 normal-case font-normal ml-1">
                  e.g. {meta.placeholder}
                </span>
              </label>
              <input
                type="text"
                value={link.username}
                onChange={(e) => updateLink(idx, { username: e.target.value })}
                placeholder={meta.placeholder}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Optional custom URL */}
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 font-semibold uppercase block">
                Custom URL
                <span className="text-slate-600 normal-case font-normal ml-1">(optional)</span>
              </label>
              <input
                type="url"
                value={link.url || ''}
                onChange={(e) => updateLink(idx, { url: e.target.value || undefined })}
                placeholder={link.username ? `${meta.baseUrl}${link.username}` : 'https://...'}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-700"
              />
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeLink(idx)}
              className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900/40 rounded transition shrink-0 mt-5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
