import React from 'react';
import type { SocialLink } from '../types/resume';
import { getSocialMeta, SOCIAL_ICONS } from '../utils/socialLinks';

interface SocialLinkBarProps {
  links: SocialLink[];
  /** Rendering style: 'row' = horizontal chips, 'column' = vertical list, 'icons-only' = just icons */
  layout?: 'row' | 'column' | 'icons-only';
  className?: string;
  iconSize?: number;
  /** text color class override */
  textClass?: string;
}

const SocialSvgIcon: React.FC<{ platform: SocialLink['platform']; size?: number; color?: string }> = ({ platform, size = 14, color }) => {
  const { viewBox, paths } = SOCIAL_ICONS[platform];
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill={color || 'currentColor'}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-hidden="true"
    >
      {paths.map((p, i) => <path key={i} d={p.d} />)}
    </svg>
  );
};

export const SocialLinkBar: React.FC<SocialLinkBarProps> = ({
  links,
  layout = 'row',
  className = '',
  iconSize = 12,
  textClass = 'text-gray-600',
}) => {
  if (!links || links.length === 0) return null;

  if (layout === 'icons-only') {
    return (
      <div className={`flex flex-wrap gap-2 items-center ${className}`}>
        {links.map((link, i) => {
          const meta = getSocialMeta(link);
          return (
            <a
              key={i}
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${meta.label}: ${link.username}`}
              style={{ color: meta.color }}
            >
              <SocialSvgIcon platform={link.platform} size={iconSize} color={meta.color} />
            </a>
          );
        })}
      </div>
    );
  }

  if (layout === 'column') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {links.map((link, i) => {
          const meta = getSocialMeta(link);
          return (
            <a
              key={i}
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 no-underline ${textClass}`}
            >
              <SocialSvgIcon platform={link.platform} size={iconSize} color={meta.color} />
              <span style={{ fontSize: '0.75em' }}>{link.username}</span>
            </a>
          );
        })}
      </div>
    );
  }

  // row (default)
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 items-center ${className}`}>
      {links.map((link, i) => {
        const meta = getSocialMeta(link);
        return (
          <a
            key={i}
            href={meta.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 no-underline ${textClass}`}
            title={meta.label}
          >
            <SocialSvgIcon platform={link.platform} size={iconSize} color={meta.color} />
            <span style={{ fontSize: '0.75em' }}>{link.username}</span>
          </a>
        );
      })}
    </div>
  );
};
