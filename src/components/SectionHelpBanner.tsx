import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, BookOpen } from 'lucide-react';

export interface HelpStep {
  stepNumber: number;
  title: string;
  detail: string;
}

export interface HelpTerm {
  term: string;
  definition: string;
}

interface SectionHelpBannerProps {
  sectionTitle: string;
  plainEnglishSummary: string;
  steps: HelpStep[];
  keyTerms: HelpTerm[];
  onOpenFullHelp?: () => void;
}

export const SectionHelpBanner: React.FC<SectionHelpBannerProps> = ({
  sectionTitle,
  plainEnglishSummary,
  steps,
  keyTerms,
  onOpenFullHelp,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-sky-50/90 border border-sky-200 rounded-xl shadow-xs overflow-hidden no-print">
      {/* Header Bar */}
      <div className="px-4 sm:px-5 py-3 bg-sky-100/80 border-b border-sky-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#0F172A] text-sky-300">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
              How to Use This Section &amp; What Everything Means
            </span>
            <h3 className="text-sm font-bold text-slate-900">{sectionTitle}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFullHelp && (
            <button
              type="button"
              onClick={onOpenFullHelp}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-sky-300 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-700" />
              Full Glossary &amp; Guide
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0F172A] text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isOpen ? (
              <>
                Hide Guide <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show Steps &amp; Definitions <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Plain English Overview */}
          <div className="p-3.5 rounded-lg bg-white border border-sky-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">In Plain English: </strong>
            {plainEnglishSummary}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Step-by-Step Checklist to Follow */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-sky-200/90 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Steps to Follow in This Section
              </h4>
              <ol className="space-y-2.5">
                {steps.map((s) => (
                  <li key={s.stepNumber} className="flex items-start gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#0F172A] text-white font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {s.stepNumber}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{s.title}: </span>
                      <span className="text-slate-700 leading-relaxed">{s.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Terms Explained */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-sky-200/90 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-700" />
                What the Terms Here Mean
              </h4>
              <dl className="space-y-2.5 text-xs">
                {keyTerms.map((kt) => (
                  <div key={kt.term} className="pb-2 border-b border-slate-100 last:border-none last:pb-0">
                    <dt className="font-bold text-slate-900">{kt.term}</dt>
                    <dd className="text-slate-600 mt-0.5 leading-relaxed">{kt.definition}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
