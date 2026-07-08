import React, { useState } from 'react';
import type { ResumeData } from '../types/resume';
import { scanAts } from '../utils/ats';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Sparkles, 
  Search
} from 'lucide-react';

interface AtsScannerProps {
  resumeData: ResumeData;
}

export const AtsScanner: React.FC<AtsScannerProps> = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  
  const report = scanAts(resumeData, jobDescription);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-500/10';
    return 'text-rose-500 border-rose-500 bg-rose-500/10';
  };

  const getWarningIcon = (type: 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold tracking-wide">ATS Optimization Scanner</h2>
        </div>
        <div className={`px-3 py-1 border text-sm font-semibold rounded-full ${getScoreColor(report.score)}`}>
          Format Score: {report.score}/100
        </div>
      </div>

      <p className="text-xs text-slate-400">
        MNC recruiters use Automated Tracking Systems (ATS). Our client-side scanner checks formatting conventions and helps you match skills from the job description.
      </p>

      {/* Formatting Checks Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Formatting Flags</span>
          <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md">
            {report.warnings.length}
          </span>
        </h3>
        
        {report.warnings.length === 0 ? (
          <div className="flex items-center gap-2.5 bg-emerald-950/20 border border-emerald-900/50 p-3.5 rounded-lg text-emerald-400 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Formatting looks perfect!</p>
              <p className="text-xs text-emerald-500/80">No structural flags detected. Ready for automated parsing engines.</p>
            </div>
          </div>
        ) : (
          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {report.warnings.map((warning) => (
              <div 
                key={warning.id} 
                className="flex items-start gap-3 bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg text-sm transition hover:border-slate-700"
              >
                {getWarningIcon(warning.type)}
                <div className="space-y-1">
                  <p className="font-semibold text-slate-200">{warning.message}</p>
                  <p className="text-xs text-slate-400">{warning.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keyword Matcher Section */}
      <div className="border-t border-slate-800/80 pt-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Job Description Keyword Matcher</span>
        </h3>

        <div className="space-y-2">
          <label htmlFor="jd-input" className="text-xs text-slate-400 block">
            Paste target job description to match missing skills:
          </label>
          <textarea
            id="jd-input"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste description requirements (e.g. 'We are looking for a React developer with TypeScript, Docker, and AWS experience...')"
            className="w-full text-sm bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
          />
        </div>

        {report.keywordMatch && (
          <div className="space-y-4 bg-slate-950/60 border border-slate-800/60 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300 font-medium">Keyword Match Score:</span>
              <span className={`text-lg font-extrabold ${
                report.keywordMatch.score >= 70 ? 'text-emerald-400' : 
                report.keywordMatch.score >= 40 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {report.keywordMatch.score}%
              </span>
            </div>
            
            {/* Score visual indicator bar */}
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  report.keywordMatch.score >= 70 ? 'bg-emerald-500' : 
                  report.keywordMatch.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${report.keywordMatch.score}%` }}
              />
            </div>

            {/* Matched Keywords Grid */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
                Matched Keywords ({report.keywordMatch.matched.length})
              </span>
              {report.keywordMatch.matched.length === 0 ? (
                <span className="text-xs text-slate-500 italic block">None matched yet. Try integrating missing terms below.</span>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {report.keywordMatch.matched.map((kw, i) => (
                    <span 
                      key={`matched-${i}`} 
                      className="text-xs bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded-full font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Keywords Grid */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider flex items-center gap-1">
                <span>Missing Keywords ({report.keywordMatch.missing.length})</span>
                {report.keywordMatch.missing.length > 0 && (
                  <span className="text-[10px] lowercase text-indigo-400 font-normal normal-case">(add these to boost ATS matches)</span>
                )}
              </span>
              {report.keywordMatch.missing.length === 0 ? (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>100% matched! Excellent alignment with job description.</span>
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {report.keywordMatch.missing.map((kw, i) => (
                    <span 
                      key={`missing-${i}`} 
                      className="text-xs bg-rose-950/40 border border-rose-900/60 text-rose-400 px-2 py-0.5 rounded-full font-medium hover:bg-rose-900/25 transition cursor-help"
                      title="Try adding this exact word into your experience or skills list"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
