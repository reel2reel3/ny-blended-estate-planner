import React, { useState } from 'react';
import { FileText, X, Check, Shield } from 'lucide-react';

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (planName: string) => void;
}

export const NewPlanModal: React.FC<NewPlanModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [planName, setPlanName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = planName.trim() || 'My Family Estate Plan';
    onCreate(finalName);
    setPlanName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Start a New Estate Plan</h3>
              <p className="text-xs text-slate-300">Start with zero accounts, zero example data, and name your plan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="react-new-plan-name" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Plan Name / Client Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="react-new-plan-name"
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g., My Family Estate Plan, Smith 2026, or Client Name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              autoFocus
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Give this plan a recognizable title so you can easily identify it and open it later.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" /> Clean Slate Guarantee:
            </div>
            <ul className="space-y-1 text-slate-600 pl-4 list-disc text-[11px]">
              <li><strong>0 Accounts:</strong> All sample IRAs, brokerages, and bank accounts are cleared.</li>
              <li><strong>No Dummy Names:</strong> Testator, spouse, children, and executor fields start blank.</li>
              <li><strong>$0 Balances:</strong> Elective share simulator and probate gauges start at $0.</li>
              <li><strong>Safe Storage:</strong> Any previously saved plans under "Open Plan" remain untouched.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer transition-colors"
            >
              <Check className="w-4 h-4" />
              Create Blank Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
