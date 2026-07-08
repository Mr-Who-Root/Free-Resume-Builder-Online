import React from 'react';
import type { ResumeData } from '../types/resume';
import { DeFactoTech } from './DeFactoTech';
import { MinimalistExecutive } from './MinimalistExecutive';
import { ModernSplit } from './ModernSplit';
import { CreativeTech } from './CreativeTech';

interface TemplateRendererProps {
  data: ResumeData;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ data }) => {
  const { styles } = data;

  const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const leadingMap = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed'
  };

  const spacingMap = {
    compact: 'space-y-2',
    normal: 'space-y-3.5',
    spacious: 'space-y-5'
  };

  const marginMap = {
    small: 'p-6',
    medium: 'p-8',
    large: 'p-10'
  };

  const colorMap = {
    navy: {
      color: '#1e3a8a',
      text: 'text-blue-800',
      border: 'border-blue-800/80',
      bg: 'bg-blue-800',
      bgLight: 'bg-blue-50/80'
    },
    slate: {
      color: '#475569',
      text: 'text-slate-700',
      border: 'border-slate-700/80',
      bg: 'bg-slate-700',
      bgLight: 'bg-slate-50/80'
    },
    emerald: {
      color: '#065f46',
      text: 'text-emerald-800',
      border: 'border-emerald-800/80',
      bg: 'bg-emerald-800',
      bgLight: 'bg-emerald-50/80'
    },
    indigo: {
      color: '#4f46e5',
      text: 'text-indigo-700',
      border: 'border-indigo-700/80',
      bg: 'bg-indigo-700',
      bgLight: 'bg-indigo-50/80'
    },
    crimson: {
      color: '#b91c1c',
      text: 'text-red-800',
      border: 'border-red-800/80',
      bg: 'bg-red-800',
      bgLight: 'bg-red-50/80'
    },
    charcoal: {
      color: '#1f2937',
      text: 'text-gray-900',
      border: 'border-gray-900/80',
      bg: 'bg-gray-800',
      bgLight: 'bg-gray-100'
    }
  };

  const selectedColor = colorMap[styles.colorTheme] || colorMap.navy;

  const styleUtils = {
    fontClass: fontMap[styles.fontFamily] || 'font-sans',
    sizeClass: sizeMap[styles.fontSize] || 'text-sm',
    leadingClass: leadingMap[styles.lineHeight] || 'leading-normal',
    spacingClass: spacingMap[styles.spacing] || 'space-y-3.5',
    marginClass: marginMap[styles.margin] || 'p-8',
    accentColor: selectedColor.color,
    accentText: selectedColor.text,
    accentBorder: selectedColor.border,
    accentBg: selectedColor.bg,
    accentBgLight: selectedColor.bgLight
  };

  const templateId = styles.templateId;

  if (templateId.startsWith('tech-')) {
    return <DeFactoTech data={data} styleUtils={styleUtils} />;
  }
  if (templateId.startsWith('exec-')) {
    return <MinimalistExecutive data={data} styleUtils={styleUtils} />;
  }
  if (templateId.startsWith('split-')) {
    return <ModernSplit data={data} styleUtils={styleUtils} />;
  }
  if (templateId.startsWith('creative-')) {
    return <CreativeTech data={data} styleUtils={styleUtils} />;
  }

  return <DeFactoTech data={data} styleUtils={styleUtils} />;
};
