import React, { useRef } from 'react';
import {
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Landmark,
  Scale,
  FileText,
  Briefcase,
  Lock,
  HelpCircle,
  FolderOpen,
  Save,
} from 'lucide-react';
import { ActiveTab, EstatePlannerState } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  state: EstatePlannerState;
  activePlanName: string;
  savedPlansCount: number;
  onNewPlan: () => void;
  onOpenPlanManager: (initialMode: 'open' | 'save') => void;
  onSaveAs: () => void;
  onExportState: () => void;
  onImportState: (imported: EstatePlannerState) => void;
  onResetState: () => void;
  unprotectedCount: number;
  probateExceedsLimit: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  state,
  activePlanName,
  savedPlansCount,
  onNewPlan,
  onOpenPlanManager,
  onSaveAs,
  onExportState,
  onImportState,
  onResetState,
  unprotectedCount,
  probateExceedsLimit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result));
        if (parsed && Array.isArray(parsed.accounts) && parsed.will && parsed.electiveShare) {
          onImportState(parsed);
        } else {
          alert('Invalid backup JSON structure. Please select a valid NY Blended Estate Planner backup file.');
        }
      } catch {
        alert('Could not parse JSON backup file.');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const tabs: { id: ActiveTab; label: string; subtitle: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'assets',
      label: '1. Asset & Probate-Bypass Tracker',
      subtitle: 'SCPA § 1301 Small Estate & TOD/POD',
      icon: <Landmark className="w-4 h-4" />,
      badge: unprotectedCount + (probateExceedsLimit ? 1 : 0),
    },
    {
      id: 'elective-share',
      label: '2. Spousal Right of Election Simulator',
      subtitle: 'EPTL § 5-1.1-A Net Estate Clawback',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: 'will-generator',
      label: '3. DIY NY Backup Will Generator',
      subtitle: 'EPTL § 3-2.1 & SCPA § 1406 Affidavit',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'attorney-prep',
      label: '4. NY Attorney Visit Prep Packet',
      subtitle: 'DRL § 236(B)(3) Waiver, POA & Proxy',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'help-guide',
      label: '5. Help, Glossary & Steps Guide',
      subtitle: 'Plain-English Definitions & Checklist',
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800 no-print sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Utility & Brand Bar */}
        <div className="py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  NY Blended Estate Planner
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-700/60">
                  <Lock className="w-3 h-3" />
                  100% Client-Side Privacy
                </span>
                {activePlanName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-sky-950 text-sky-200 border border-sky-800">
                    Plan: <strong>{activePlanName}</strong>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Sole-Name Probate Bypass, <code className="text-amber-300 font-mono">EPTL § 5-1.1-A</code> Elective Share Protection &amp; Children-First Inheritance Organizer
              </p>
            </div>
          </div>

          {/* Action Toolbar: New Plan + Save As + Save Plan + Open Plan + Import + Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* New Plan Button - Resets all data and allows fresh input */}
            <button
              id="btn-new-plan"
              type="button"
              onClick={onNewPlan}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-[#0F172A] shadow-sm transition-all cursor-pointer border border-slate-300"
              title="Start a new blank estate plan (clears current form for new testator and accounts)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-800" />
              New Plan
            </button>

            {/* Dedicated "Save As..." Button - Always prompts for file and folder location */}
            <button
              id="btn-save-as"
              type="button"
              onClick={onSaveAs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all cursor-pointer ring-1 ring-amber-300"
              title="Save As... Prompts you to pick an exact folder and name on your computer"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              Save As...
            </button>

            {/* Quick In-Browser Save Plan Button */}
            <button
              id="btn-save-plan"
              type="button"
              onClick={() => onOpenPlanManager('save')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer"
              title="Save current plan state under a friendly name in your browser"
            >
              <Save className="w-3.5 h-3.5" />
              Save Plan
            </button>

            {/* Open Saved Plan Button */}
            <button
              id="btn-open-plan"
              type="button"
              onClick={() => onOpenPlanManager('open')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors cursor-pointer"
              title="Open or switch to another saved plan"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Open Plan {savedPlansCount > 0 ? `(${savedPlansCount})` : ''}
            </button>

            {/* Help & Glossary Shortcut */}
            <button
              id="btn-open-help"
              type="button"
              onClick={() => setActiveTab('help-guide')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors cursor-pointer"
              title="Open plain-English glossary and step-by-step instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              Help &amp; Steps
            </button>

            {/* Export / Save to Folder JSON */}
            <button
              id="btn-export-backup"
              type="button"
              onClick={onExportState}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
              title="Pick a folder on your computer (Documents, Desktop, USB) to save your plan JSON file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Save to Folder / Export (JSON)
            </button>

            {/* Import Backup JSON from Computer File */}
            <button
              id="btn-import-backup"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
              title="Restore data from a previously downloaded .json backup file"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              Import Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Reset All Data */}
            <button
              id="btn-reset-all-data"
              type="button"
              onClick={onResetState}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 border border-rose-800/70 transition-colors cursor-pointer"
              title="Reset all data to default or clear localStorage"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              Reset
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 py-2.5" aria-label="Main Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white text-[#0F172A] border-white shadow-sm font-semibold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`p-1.5 rounded-md shrink-0 ${
                      isActive ? 'bg-[#0F172A] text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div className="truncate">
                    <div className="text-xs leading-tight truncate">{tab.label}</div>
                    <div
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-slate-600 font-normal' : 'text-slate-400'
                      }`}
                    >
                      {tab.subtitle}
                    </div>
                  </div>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                      probateExceedsLimit
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
