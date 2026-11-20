import React, { useState } from 'react';
import {
  FolderOpen,
  Save,
  Plus,
  Trash2,
  Clock,
  Check,
  X,
  FileCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EstatePlannerState, SavedPlanSlot } from '../types';

interface PlanManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SavedPlanSlot[];
  currentState: EstatePlannerState;
  activePlanName: string;
  onSavePlan: (planName: string) => void;
  onLoadPlan: (plan: SavedPlanSlot) => void;
  onDeletePlan: (planId: string) => void;
  initialMode?: 'open' | 'save';
}

export const PlanManagerModal: React.FC<PlanManagerModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  currentState,
  activePlanName,
  onSavePlan,
  onLoadPlan,
  onDeletePlan,
  initialMode = 'open',
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'save'>(initialMode);
  const [planNameInput, setPlanNameInput] = useState(
    activePlanName || `${currentState.will.testatorName || 'Family'} Estate Plan`
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planNameInput.trim()) return;
    onSavePlan(planNameInput.trim());
    onClose();
  };

  const handleSelectPlan = (plan: SavedPlanSlot) => {
    onLoadPlan(plan);
    onClose();
  };

  const currentTotal = currentState.accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {activeTab === 'open' ? (
                <FolderOpen className="w-5 h-5 text-emerald-400" />
              ) : (
                <Save className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {activeTab === 'open' ? 'Open a Saved Plan' : 'Save Current Plan'}
              </h3>
              <p className="text-xs text-slate-300">
                Switch between different client scenarios, families, or what-if drafts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('open')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'open'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-sky-600" />
            Open Plan ({savedPlans.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('save')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'save'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Save className="w-4 h-4 text-emerald-600" />
            Save as New / Update
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'open' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span>Select a plan to open and resume working:</span>
                <span className="font-mono text-[11px]">Stored in this browser (100% private)</span>
              </div>

              {savedPlans.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                  <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No saved plans yet</p>
                  <p className="text-xs text-slate-500">
                    Use the &ldquo;Save as New / Update&rdquo; tab above to save your first plan.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedPlans.map((plan) => {
                    const planTotal = plan.state.accounts.reduce((s, a) => s + a.balance, 0);
                    const isCurrentlyActive = plan.name === activePlanName;

                    return (
                      <div
                        key={plan.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCurrentlyActive
                            ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {plan.name}
                            </h4>
                            {isCurrentlyActive && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                                Currently Open
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>
                              Testator: <strong>{plan.state.will.testatorName || 'Unnamed'}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Accounts: <strong>{plan.state.accounts.length}</strong>
                            </span>
                            <span>•</span>
                            <span className="font-mono font-bold text-slate-700">
                              {formatCurrency(planTotal)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3" />
                              {formatDate(plan.savedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {confirmDeleteId === plan.id ? (
                            <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <span className="text-[11px] font-bold text-rose-700 px-1">
                                Delete?
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeletePlan(plan.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSelectPlan(plan)}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0F172A] hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                                Open
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(plan.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete this plan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Save Tab */
            <form onSubmit={handleQuickSave} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Currently Open Plan Snapshot:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {formatCurrency(currentTotal)} across {currentState.accounts.length} accounts
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>
                    Testator: <strong>{currentState.will.testatorName || 'Not specified'}</strong>{' '}
                    ({currentState.will.county} County)
                  </div>
                  <div>
                    Spouse: <strong>{currentState.will.spouseName || 'Not specified'}</strong>
                  </div>
                  <div>
                    Children:{' '}
                    <strong>
                      {currentState.will.children
                        .map((c) => c.fullName)
                        .filter(Boolean)
                        .join(', ') || 'None listed'}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="plan-name-input"
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Plan Name / Label
                </label>
                <input
                  id="plan-name-input"
                  type="text"
                  value={planNameInput}
                  onChange={(e) => setPlanNameInput(e.target.value)}
                  placeholder="e.g., Robert Vance - Scenario with $25k Checking Buffer"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Use descriptive names like &ldquo;Vance Family - With TODs&rdquo; or &ldquo;Smith Draft A&rdquo; so you can easily distinguish multiple plans.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Saving creates a slot in your browser so you can switch between plans anytime.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 bg-white/70 p-2.5 rounded border border-emerald-300">
                  <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Want to pick an exact folder on your computer?</strong> (e.g., Desktop, Documents, or USB drive): Use the top-bar <strong>&ldquo;Save to Folder / Export (JSON)&rdquo;</strong> button, which prompts your operating system&apos;s &ldquo;Save As&rdquo; folder picker.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSavePlan(planNameInput.trim() || 'My Estate Plan');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save In-Browser
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    (window as any).dispatchEvent(new CustomEvent('trigger-save-as'));
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Prompts your operating system's Save As dialog to choose a folder on your computer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Save As... (Pick Folder)
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Explainer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              <strong>Difference:</strong> &ldquo;Save / Open&rdquo; manages plans inside your browser; &ldquo;Export Backup (JSON)&rdquo; saves a portable file onto your hard drive.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
