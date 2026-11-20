import React, { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';
import { ActiveTab, EstatePlannerState, SavedPlanSlot } from './types';
import { BLANK_ESTATE_STATE, DEFAULT_ESTATE_STATE, SAVED_PLANS_KEY, STORAGE_KEY } from './defaultState';
import { Header } from './components/Header';
import { AssetTrackerTab } from './components/AssetTrackerTab';
import { ElectiveShareTab } from './components/ElectiveShareTab';
import { BackupWillTab } from './components/BackupWillTab';
import { AttorneyPrepTab } from './components/AttorneyPrepTab';
import { HelpGuideTab } from './components/HelpGuideTab';
import { PlanManagerModal } from './components/PlanManagerModal';
import { NewPlanModal } from './components/NewPlanModal';
import { SaveAsModal } from './components/SaveAsModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assets');
  const [activePlanName, setActivePlanName] = useState<string>('Robert J. Vance - Baseline Plan');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<'open' | 'save'>('open');
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);

  // Load Saved Plans list from localStorage
  const [savedPlans, setSavedPlans] = useState<SavedPlanSlot[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_PLANS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load saved plans:', e);
    }
    // Default initial sample saved plans so user immediately sees how it works
    return [
      {
        id: 'plan-baseline',
        name: 'Robert J. Vance - Baseline Plan',
        savedAt: new Date().toISOString(),
        state: DEFAULT_ESTATE_STATE,
      },
      {
        id: 'plan-scenario-buffer',
        name: 'Vance Family - With $35k Cash Liquidity Buffer',
        savedAt: new Date(Date.now() - 86400000).toISOString(),
        state: {
          ...DEFAULT_ESTATE_STATE,
          accounts: DEFAULT_ESTATE_STATE.accounts.map((a) =>
            a.id === 'acc-5' ? { ...a, balance: 35000 } : a
          ),
        },
      },
    ];
  });

  // Load current working plan state
  const [state, setState] = useState<EstatePlannerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.accounts) && parsed.will && parsed.electiveShare) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading state from localStorage:', err);
    }
    return DEFAULT_ESTATE_STATE;
  });

  // Auto-save active state to active slot and STORAGE_KEY
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...state,
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error('Error saving state to localStorage:', err);
    }
  }, [state]);

  // Listen for trigger-save-as and copy-plan-json events from modal
  useEffect(() => {
    const handleTriggerSaveAs = () => {
      handleExportState();
    };
    const handleCopyPlanJson = () => {
      const dataStr = getBackupJsonString();
      navigator.clipboard?.writeText(dataStr);
    };
    window.addEventListener('trigger-save-as', handleTriggerSaveAs);
    window.addEventListener('copy-plan-json', handleCopyPlanJson);
    return () => {
      window.removeEventListener('trigger-save-as', handleTriggerSaveAs);
      window.removeEventListener('copy-plan-json', handleCopyPlanJson);
    };
  }, [state, activePlanName, savedPlans]);

  // Persist saved plans catalog
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(savedPlans));
    } catch (err) {
      console.error('Error saving plans catalog to localStorage:', err);
    }
  }, [savedPlans]);

  const handleOpenPlanManager = (mode: 'open' | 'save') => {
    setPlanModalMode(mode);
    setIsPlanModalOpen(true);
  };

  const handleNewPlan = () => {
    setIsNewPlanModalOpen(true);
  };

  const handleCreateBlankPlan = (planName: string) => {
    const newBlank = JSON.parse(JSON.stringify(BLANK_ESTATE_STATE));
    newBlank.lastUpdated = new Date().toISOString();
    setState(newBlank);
    setActivePlanName(planName);
    setActiveTab('assets');
    setIsNewPlanModalOpen(false);

    // Also register into saved plans
    const newSlot: SavedPlanSlot = {
      id: `plan-${Date.now()}`,
      name: planName,
      savedAt: new Date().toISOString(),
      state: JSON.parse(JSON.stringify(newBlank)),
    };
    setSavedPlans([newSlot, ...savedPlans]);
  };

  const handleSavePlan = (planName: string) => {
    const existingIndex = savedPlans.findIndex((p) => p.name.toLowerCase() === planName.toLowerCase());
    const newSlot: SavedPlanSlot = {
      id: existingIndex >= 0 ? savedPlans[existingIndex].id : `plan-${Date.now()}`,
      name: planName,
      savedAt: new Date().toISOString(),
      state: JSON.parse(JSON.stringify(state)),
    };

    if (existingIndex >= 0) {
      const updated = [...savedPlans];
      updated[existingIndex] = newSlot;
      setSavedPlans(updated);
    } else {
      setSavedPlans([newSlot, ...savedPlans]);
    }
    setActivePlanName(planName);
  };

  const handleLoadPlan = (plan: SavedPlanSlot) => {
    setState(JSON.parse(JSON.stringify(plan.state)));
    setActivePlanName(plan.name);
  };

  const handleDeletePlan = (planId: string) => {
    setSavedPlans(savedPlans.filter((p) => p.id !== planId));
  };

  const getBackupJsonString = () => {
    const exportBundle = {
      appName: 'NY Blended Estate Planner',
      exportDate: new Date().toISOString(),
      activePlanName,
      activeState: state,
      allSavedPlans: savedPlans,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const handleSaveToDirectory = async (fileName: string) => {
    const dataStr = getBackupJsonString();
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(dataStr);
        await writable.close();
        setIsSaveAsModalOpen(false);
        alert(`Successfully saved "${fileName}" in folder: "${dirHandle.name}"!`);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Directory picker error:', err);
        alert('Folder selection was restricted by your browser. Please use Direct Download or open in a new tab.');
        return;
      }
    }
    alert('Your browser does not support folder picker. Using Save File dialog instead.');
    await handleSaveWithPicker(fileName);
  };

  const handleSaveWithPicker = async (fileName: string) => {
    const dataStr = getBackupJsonString();
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'JSON Estate Plan Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(dataStr);
        await writable.close();
        setIsSaveAsModalOpen(false);
        alert(`Saved file: ${handle.name}`);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('File picker error:', err);
      }
    }
    handleDirectDownload(fileName);
  };

  const handleDirectDownload = (fileName: string) => {
    const dataStr = getBackupJsonString();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsSaveAsModalOpen(false);
  };

  const handleSaveAs = () => {
    setIsSaveAsModalOpen(true);
  };

  const handleExportState = () => {
    setIsSaveAsModalOpen(true);
  };

  const handleImportState = (imported: any) => {
    if (imported && imported.activeState && Array.isArray(imported.activeState.accounts)) {
      setState(imported.activeState);
      if (imported.activePlanName) setActivePlanName(imported.activePlanName);
      if (Array.isArray(imported.allSavedPlans)) {
        setSavedPlans(imported.allSavedPlans);
      }
    } else if (imported && Array.isArray(imported.accounts)) {
      setState(imported);
      if (imported.will?.testatorName) {
        setActivePlanName(`${imported.will.testatorName} Estate Plan`);
      }
    }
  };

  const handleResetState = () => {
    if (
      window.confirm(
        'Reset current working plan to default sample values? (Your saved plans list in "Open Plan" will remain intact).'
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setState(DEFAULT_ESTATE_STATE);
      setActivePlanName('Robert J. Vance - Baseline Plan');
    }
  };

  const unprotectedCount = state.accounts.filter(
    (a) =>
      (a.accountType === 'Taxable Brokerage' &&
        a.transferMechanism !== 'TOD (Transfer on Death)') ||
      ((a.accountType === 'Checking Account' || a.accountType === 'Savings / CD') &&
        a.transferMechanism !== 'POD (Payable on Death / Totten Trust)')
  ).length;

  const totalSoleProbate = state.accounts
    .filter(
      (a) =>
        a.ownershipTitle === 'Sole Name' &&
        a.transferMechanism === 'None (Probate Asset)'
    )
    .reduce((sum, a) => sum + a.balance, 0);

  const probateExceedsLimit = totalSoleProbate > 50000;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        state={state}
        activePlanName={activePlanName}
        savedPlansCount={savedPlans.length}
        onNewPlan={handleNewPlan}
        onOpenPlanManager={handleOpenPlanManager}
        onSaveAs={handleExportState}
        onExportState={handleExportState}
        onImportState={handleImportState}
        onResetState={handleResetState}
        unprotectedCount={unprotectedCount}
        probateExceedsLimit={probateExceedsLimit}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'assets' && (
          <AssetTrackerTab
            accounts={state.accounts}
            childrenList={state.will.children}
            onUpdateAccounts={(accounts) => setState({ ...state, accounts })}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'elective-share' && (
          <ElectiveShareTab
            accounts={state.accounts}
            config={state.electiveShare}
            spouseName={state.will.spouseName}
            onUpdateConfig={(electiveShare) => setState({ ...state, electiveShare })}
            onNavigateToAttorneyPrep={() => setActiveTab('attorney-prep')}
            onOpenHelp={() => setActiveTab('help-guide')}
          />
        )}

        {activeTab === 'will-generator' && (
          <BackupWillTab
            will={state.will}
            onUpdateWill={(will) => setState({ ...state, will })}
            onOpenHelp={() => setActiveTab('help-guide')}
          />
        )}

        {activeTab === 'attorney-prep' && (
          <AttorneyPrepTab
            accounts={state.accounts}
            will={state.will}
            prep={state.attorneyPrep}
            onUpdatePrep={(attorneyPrep) => setState({ ...state, attorneyPrep })}
            onOpenHelp={() => setActiveTab('help-guide')}
          />
        )}

        {activeTab === 'help-guide' && (
          <HelpGuideTab onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Plan Manager Modal (Save & Open) */}
      <PlanManagerModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        savedPlans={savedPlans}
        currentState={state}
        activePlanName={activePlanName}
        onSavePlan={handleSavePlan}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeletePlan}
        initialMode={planModalMode}
      />

      {/* New Plan Modal */}
      <NewPlanModal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        onCreate={handleCreateBlankPlan}
      />

      {/* Save As Modal (Pick Folder / Computer Location) */}
      <SaveAsModal
        isOpen={isSaveAsModalOpen}
        onClose={() => setIsSaveAsModalOpen(false)}
        defaultFileName={`ny-estate-plan-${(activePlanName || 'estate-plan').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`}
        onSaveToDirectory={handleSaveToDirectory}
        onSaveWithPicker={handleSaveWithPicker}
        onDirectDownload={handleDirectDownload}
      />

      {/* Persistent Legal Disclaimer Footer Banner */}
      <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 py-3.5 px-4 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <em>
                Educational &amp; organizational tool only. Not legal advice. Consult a New York estate planning attorney before executing legal instruments.
              </em>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono shrink-0">
            NY EPTL § 5-1.1-A • EPTL § 3-2.1 • SCPA § 1301 • SCPA § 1406 • GOL § 5-1513
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
