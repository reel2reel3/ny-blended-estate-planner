import React, { useState } from 'react';
import {
  Briefcase,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  FileSignature,
  HeartPulse,
  Shield,
  DollarSign,
} from 'lucide-react';
import {
  AssetAccount,
  AttorneyPrepConfig,
  CoAgentRule,
  WillConfig,
} from '../types';
import { SectionHelpBanner } from './SectionHelpBanner';

interface AttorneyPrepTabProps {
  accounts: AssetAccount[];
  will: WillConfig;
  prep: AttorneyPrepConfig;
  onUpdatePrep: (prep: AttorneyPrepConfig) => void;
  onOpenHelp?: () => void;
}

export const AttorneyPrepTab: React.FC<AttorneyPrepTabProps> = ({
  accounts,
  will,
  prep,
  onUpdatePrep,
  onOpenHelp,
}) => {
  const [newSpouseInst, setNewSpouseInst] = useState('');
  const [newSpouseType, setNewSpouseType] = useState('Retirement / IRA / 401(k)');
  const [newSpouseBalance, setNewSpouseBalance] = useState('100000');

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const userTotalAssets = accounts.reduce((sum, a) => sum + a.balance, 0);
  const spouseTotalAssets = prep.spouseAccounts.reduce((sum, s) => sum + s.balance, 0);

  const handleAddSpouseAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpouseInst.trim()) return;
    onUpdatePrep({
      ...prep,
      spouseAccounts: [
        ...prep.spouseAccounts,
        {
          id: `sp-${Date.now()}`,
          institution: newSpouseInst.trim(),
          accountType: newSpouseType,
          balance: Math.max(0, Number(newSpouseBalance) || 0),
        },
      ],
    });
    setNewSpouseInst('');
    setNewSpouseBalance('100000');
  };

  const handleRemoveSpouseAccount = (id: string) => {
    onUpdatePrep({
      ...prep,
      spouseAccounts: prep.spouseAccounts.filter((s) => s.id !== id),
    });
  };

  const handlePrintBriefing = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <SectionHelpBanner
        sectionTitle="Section 4 Guide: Preparing for a Single Flat-Fee NY Attorney Visit"
        plainEnglishSummary="Because New York's Mutual Waiver of Right of Election (EPTL § 5-1.1-A(e)) must use strict real-estate deed acknowledgment wording (DRL § 236(B)(3)) and include mutual financial disclosures so it can never be challenged later, having a New York estate attorney draft and notarize the waiver is the gold standard. This page organizes everything into a 1-page briefing sheet so you can request a simple, low-cost flat-fee engagement."
        steps={[
          {
            stepNumber: 1,
            title: 'Add Your Spouse’s Approximate Separate Assets (Schedule B)',
            detail:
              'Your own accounts (Schedule A) are auto-populated from Tab 1. Add your spouse’s main retirement/bank accounts on the left so both sides have documented financial disclosure.',
          },
          {
            stepNumber: 2,
            title: 'Select Your Power of Attorney (POA) & Health Care Proxy Agents',
            detail:
              'Choose who (typically your adult children) will manage your finances if you are incapacitated (POA) and make medical decisions if you cannot speak for yourself (Health Care Proxy).',
          },
          {
            stepNumber: 3,
            title: 'Choose Co-Agent & Gifting Rules for Your POA',
            detail:
              '"Act Separately" lets either child handle a bank task without needing two signatures. Enable Gifting Modifications if you want to prohibit any agent from ever changing your TOD/POD/IRA beneficiaries.',
          },
          {
            stepNumber: 4,
            title: 'Click "Print Attorney Briefing Packet"',
            detail:
              'Hand this 1-page summary to your NY estate attorney so they don’t bill you hourly for basic intake and know the exact 3 instruments you want executed.',
          },
        ]}
        keyTerms={[
          {
            term: 'Schedule A & Schedule B Disclosures',
            definition:
              'Written lists of each spouse’s assets attached to a postnuptial waiver so neither side can ever claim assets were hidden.',
          },
          {
            term: 'DRL § 236(B)(3) / RPL § 309-a Deed Form',
            definition:
              'The specific New York notary acknowledgment block used on real estate deeds, required for marital and elective-share waivers.',
          },
          {
            term: 'NY Statutory Short Form POA (GOL § 5-1513)',
            definition:
              'Financial Power of Attorney. Since June 2021, NY requires 2 disinterested witnesses PLUS a Notary Public.',
          },
          {
            term: 'Act Separately vs. Act Jointly',
            definition:
              '"Act Separately" allows either named child to act independently; "Act Jointly" requires both children to co-sign every transaction.',
          },
        ]}
        onOpenFullHelp={onOpenHelp}
      />
      {/* Top Action Bar (Hidden in Print) */}
      <div className="bg-[#0F172A] text-white rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-semibold">
            <Briefcase className="w-3.5 h-3.5" /> Flat-Fee NY Counsel Consultation Packet
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            New York Estate Planning Attorney Briefing Sheet Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Walking into a New York estate planning attorney&apos;s office with complete Schedules A &amp; B financial disclosures and pre-selected fiduciary designations allows you to request a targeted, flat-fee drafting engagement.
          </p>
        </div>

        <button
          id="btn-print-attorney-packet"
          type="button"
          onClick={handlePrintBriefing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print Attorney Briefing Packet
        </button>
      </div>

      {/* Interactive Configuration Controls (Hidden in Print) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Left: Spouse Separate Accounts Editor (Schedule B) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Schedule B: Spouse&apos;s Separate Assets ({will.spouseName || 'Spouse'})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attaching mutual financial disclosures prevents any future claim that the <code className="font-mono">EPTL § 5-1.1-A(e)</code> waiver was signed without fair knowledge of each spouse&apos;s net worth.
            </p>
          </div>

          <form onSubmit={handleAddSpouseAccount} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Spouse Account / Asset Description
              </label>
              <input
                id="input-spouse-asset-desc"
                type="text"
                value={newSpouseInst}
                onChange={(e) => setNewSpouseInst(e.target.value)}
                placeholder="e.g., TIAA 403(b), Citibank Savings, Separate Condo"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Category
                </label>
                <select
                  value={newSpouseType}
                  onChange={(e) => setNewSpouseType(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="Retirement / IRA / 401(k)">Retirement / IRA / 401(k)</option>
                  <option value="Taxable Brokerage">Taxable Brokerage</option>
                  <option value="Savings / CD / Checking">Savings / CD / Checking</option>
                  <option value="Real Estate / Co-op">Real Estate / Co-op</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approx. Balance ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newSpouseBalance}
                    onChange={(e) => setNewSpouseBalance(e.target.value)}
                    className="w-full pl-7 pr-2.5 py-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Spouse Asset to Disclosure Table
            </button>
          </form>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {prep.spouseAccounts.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">
                No spouse separate accounts added yet (optional).
              </div>
            ) : (
              prep.spouseAccounts.map((sp) => (
              <div
                key={sp.id}
                className="p-2.5 bg-slate-50 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{sp.institution}</div>
                  <div className="text-slate-500">{sp.accountType}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(sp.balance)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpouseAccount(sp.id)}
                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>

        {/* Right: Section B Instrument Parameters Editor */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Configure Requested NY Legal Instruments
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize agent names and statutory options for your Power of Attorney (<code className="font-mono">GOL § 5-1513</code>) and Health Care Proxy.
            </p>
          </div>

          {/* NY Statutory Short Form Power of Attorney Inputs */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-slate-800" />
                <h4 className="text-sm font-bold text-slate-900">
                  NY Statutory Short Form Power of Attorney (<code className="font-mono text-xs">GOL § 5-1513</code>)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">
                Requires 2 Disinterested Witnesses + Notary
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary POA Agent
                </label>
                <input
                  id="input-poa-primary"
                  type="text"
                  value={prep.poaPrimaryAgent}
                  onChange={(e) => onUpdatePrep({ ...prep, poaPrimaryAgent: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Successor POA Agent
                </label>
                <input
                  id="input-poa-successor"
                  type="text"
                  value={prep.poaSuccessorAgent}
                  onChange={(e) => onUpdatePrep({ ...prep, poaSuccessorAgent: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Co-Agent Authority Rule
                </label>
                <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 w-full">
                  {(['Act Separately', 'Act Jointly'] as CoAgentRule[]).map((rule) => (
                    <button
                      key={rule}
                      type="button"
                      onClick={() => onUpdatePrep({ ...prep, poaCoAgentRule: rule })}
                      className={`flex-1 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        prep.poaCoAgentRule === rule
                          ? 'bg-[#0F172A] text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      {rule}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section (g) Gifting / Beneficiary Modifications
                </label>
                <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 w-full">
                  <button
                    type="button"
                    onClick={() => onUpdatePrep({ ...prep, poaGiftingModifications: true })}
                    className={`flex-1 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      prep.poaGiftingModifications
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    Include Modifications
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePrep({ ...prep, poaGiftingModifications: false })}
                    className={`flex-1 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      !prep.poaGiftingModifications
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    Standard ($5k Cap)
                  </button>
                </div>
              </div>
            </div>

            {prep.poaGiftingModifications && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Section (g) Modification Instructions for Counsel
                </label>
                <textarea
                  rows={2}
                  value={prep.poaGiftingNotes}
                  onChange={(e) => onUpdatePrep({ ...prep, poaGiftingNotes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
            )}
          </div>

          {/* NY Health Care Proxy Inputs */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-700" />
              <h4 className="text-sm font-bold text-slate-900">
                NY Health Care Proxy (<code className="font-mono text-xs">PHL Article 29-C</code>)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Health Care Agent
                </label>
                <input
                  id="input-hcp-primary"
                  type="text"
                  value={prep.hcpPrimaryAgent}
                  onChange={(e) => onUpdatePrep({ ...prep, hcpPrimaryAgent: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Agent Phone
                </label>
                <input
                  type="text"
                  value={prep.hcpPrimaryPhone}
                  onChange={(e) => onUpdatePrep({ ...prep, hcpPrimaryPhone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Backup Health Care Agent
                </label>
                <input
                  id="input-hcp-backup"
                  type="text"
                  value={prep.hcpBackupAgent}
                  onChange={(e) => onUpdatePrep({ ...prep, hcpBackupAgent: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Backup Agent Phone
                </label>
                <input
                  type="text"
                  value={prep.hcpBackupPhone}
                  onChange={(e) => onUpdatePrep({ ...prep, hcpBackupPhone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Age 62+ Documents & Blended-Family Protection Editor (No-Print) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        {/* Card A: Living Will, HIPAA Release & NY Disposition of Remains (PHL § 4201) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Medical &amp; End-of-Life Directives (Age 62+ Suite)
            </h3>
            <p className="text-xs text-slate-500">
              Living Will, Stand-Alone HIPAA Release, and NY Disposition of Remains (<code className="font-mono">PHL § 4201</code>)
            </p>
          </div>

          {/* Living Will */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-900">
                4. Living Will (NY Clear &amp; Convincing Evidence Directive)
              </span>
              <input
                type="checkbox"
                checked={prep.requestLivingWill ?? true}
                onChange={(e) => onUpdatePrep({ ...prep, requestLivingWill: e.target.checked })}
                className="w-4 h-4 accent-[#0F172A] cursor-pointer"
              />
            </label>
            {(prep.requestLivingWill ?? true) && (
              <div className="grid grid-cols-1 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    End-of-Life Care Preference
                  </label>
                  <select
                    value={prep.livingWillPreference || 'Comfort Care / No Artificial Prolongation'}
                    onChange={(e) =>
                      onUpdatePrep({ ...prep, livingWillPreference: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                  >
                    <option value="Comfort Care / No Artificial Prolongation">
                      Comfort Care / No Artificial Prolongation (DNR / Palliative Focus)
                    </option>
                    <option value="Limited Trial of Life Support">
                      Limited Trial of Life Support (Agent Evaluates Recovery)
                    </option>
                    <option value="Maximum Life-Sustaining Measures">
                      Maximum Life-Sustaining Measures
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Artificial Nutrition &amp; Hydration (NY Explicit Requirement)
                  </label>
                  <select
                    value={
                      prep.livingWillArtificialNutrition ||
                      'Withhold / Withdraw if Terminal or Permanent Unconsciousness'
                    }
                    onChange={(e) =>
                      onUpdatePrep({ ...prep, livingWillArtificialNutrition: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                  >
                    <option value="Withhold / Withdraw if Terminal or Permanent Unconsciousness">
                      Withhold / Withdraw if Terminal or Permanently Unconscious
                    </option>
                    <option value="Provide Artificial Nutrition & Hydration">
                      Provide Artificial Nutrition &amp; Hydration
                    </option>
                    <option value="Defer to Health Care Agent">
                      Defer Decision to Health Care Agent
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Stand-Alone HIPAA Authorization */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-900">
                5. Stand-Alone HIPAA Medical Release (Active Before Incapacity)
              </span>
              <input
                type="checkbox"
                checked={prep.requestHipaaRelease ?? true}
                onChange={(e) => onUpdatePrep({ ...prep, requestHipaaRelease: e.target.checked })}
                className="w-4 h-4 accent-[#0F172A] cursor-pointer"
              />
            </label>
            {(prep.requestHipaaRelease ?? true) && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Authorized Family Members (Can Speak with Doctors &amp; Billing Now)
                </label>
                <input
                  type="text"
                  value={prep.hipaaAuthorizedPersons || ''}
                  onChange={(e) => onUpdatePrep({ ...prep, hipaaAuthorizedPersons: e.target.value })}
                  placeholder="e.g., Names of your children (and spouse, if desired)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
            )}
          </div>

          {/* NY Disposition of Remains (PHL § 4201) */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-amber-950">
                6. NY Disposition of Remains Agent (<code className="font-mono">PHL § 4201</code>)
              </span>
              <input
                type="checkbox"
                checked={prep.requestDispositionOfRemains ?? true}
                onChange={(e) =>
                  onUpdatePrep({ ...prep, requestDispositionOfRemains: e.target.checked })
                }
                className="w-4 h-4 accent-amber-700 cursor-pointer"
              />
            </label>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              <strong>Blended-Family Alert:</strong> Without this form, NY law gives your surviving spouse automatic control over burial vs. cremation and funeral arrangements—even with an elective-share waiver.
            </p>
            {(prep.requestDispositionOfRemains ?? true) && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={prep.dispositionPrimaryAgent || ''}
                    onChange={(e) =>
                      onUpdatePrep({ ...prep, dispositionPrimaryAgent: e.target.value })
                    }
                    placeholder="Primary Agent (e.g., Child 1)"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs text-slate-900 bg-white"
                  />
                  <input
                    type="text"
                    value={prep.dispositionSuccessorAgent || ''}
                    onChange={(e) =>
                      onUpdatePrep({ ...prep, dispositionSuccessorAgent: e.target.value })
                    }
                    placeholder="Successor Agent (e.g., Child 2)"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs text-slate-900 bg-white"
                  />
                </div>
                <input
                  type="text"
                  value={prep.dispositionWishes || ''}
                  onChange={(e) => onUpdatePrep({ ...prep, dispositionWishes: e.target.value })}
                  placeholder="Special wishes (e.g., Cremation, burial plot, memorial notes)"
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs text-slate-900 bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card B: Age 62+ Long-Term Care/Medicaid, Real Estate, Digital Assets & Letter of Instruction */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Age 62+ Long-Term Care, Real Estate &amp; Digital Binder
            </h3>
            <p className="text-xs text-slate-500">
              NY Medicaid Spousal Refusal, <code className="font-mono">RPL § 424</code> TOD Deed, <code className="font-mono">EPTL Art. 13-A</code> Digital Assets &amp; Emergency Binder
            </p>
          </div>

          {/* Long-Term Care & Medicaid */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={prep.discussMedicaidSpousalRefusal ?? true}
                onChange={(e) =>
                  onUpdatePrep({ ...prep, discussMedicaidSpousalRefusal: e.target.checked })
                }
                className="w-4 h-4 mt-0.5 accent-[#0F172A] cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  7. Review NY Medicaid Spousal Refusal &amp; 5-Year Lookback (Age 62 Window)
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Discuss Long-Term Care Insurance, Medicaid Asset Protection Trusts (MAPT), and how NY Spousal Refusal shields each spouse&apos;s separate assets.
                </p>
              </div>
            </label>
          </div>

          {/* NY Real Estate Transfer Plan */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-900">
                8. Own NY Real Estate in Sole Name? (Home / Condo / Co-op)
              </span>
              <input
                type="checkbox"
                checked={prep.ownsNyRealEstate ?? false}
                onChange={(e) => onUpdatePrep({ ...prep, ownsNyRealEstate: e.target.checked })}
                className="w-4 h-4 accent-[#0F172A] cursor-pointer"
              />
            </label>
            {prep.ownsNyRealEstate && (
              <div className="space-y-2 pt-1">
                <select
                  value={prep.realEstatePlanOption || 'NY Transfer on Death Deed (RPL § 424)'}
                  onChange={(e) =>
                    onUpdatePrep({ ...prep, realEstatePlanOption: e.target.value as any })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="NY Transfer on Death Deed (RPL § 424)">
                    NY Transfer on Death Deed (RPL § 424 — Avoids Probate)
                  </option>
                  <option value="Revocable Living Trust">Revocable Living Trust</option>
                  <option value="Medicaid Asset Protection Trust (MAPT)">
                    Medicaid Asset Protection Trust (MAPT — 5-Year Lookback)
                  </option>
                  <option value="Not Applicable (No Real Estate)">
                    Not Applicable (No Real Estate)
                  </option>
                </select>
                <input
                  type="text"
                  value={prep.realEstateNotes || ''}
                  onChange={(e) => onUpdatePrep({ ...prep, realEstateNotes: e.target.value })}
                  placeholder="Property address / county / mortgage notes"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                />
              </div>
            )}
          </div>

          {/* Digital Assets & Beneficiary Audit */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900">
              9. Digital Assets (<code className="font-mono">EPTL Art. 13-A</code>) &amp; Practical Readiness
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prep.includeDigitalAssetsClause ?? true}
                  onChange={(e) =>
                    onUpdatePrep({ ...prep, includeDigitalAssetsClause: e.target.checked })
                  }
                  className="w-3.5 h-3.5 accent-[#0F172A]"
                />
                <span>Include RUFADAA Digital Clause</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prep.appleLegacyContactSet ?? false}
                  onChange={(e) =>
                    onUpdatePrep({ ...prep, appleLegacyContactSet: e.target.checked })
                  }
                  className="w-3.5 h-3.5 accent-emerald-600"
                />
                <span>Apple Legacy Contact Set</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prep.googleInactiveManagerSet ?? false}
                  onChange={(e) =>
                    onUpdatePrep({ ...prep, googleInactiveManagerSet: e.target.checked })
                  }
                  className="w-3.5 h-3.5 accent-emerald-600"
                />
                <span>Google Inactive Mgr Set</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prep.beneficiaryAuditVerified ?? false}
                  onChange={(e) =>
                    onUpdatePrep({ ...prep, beneficiaryAuditVerified: e.target.checked })
                  }
                  className="w-3.5 h-3.5 accent-emerald-600"
                />
                <span>Custodian PDFs Audited</span>
              </label>
            </div>
          </div>

          {/* Letter of Instruction / Document Storage */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900">
              10. Letter of Instruction (For Your Children — Never Store Passwords Here)
            </div>
            <input
              type="text"
              value={prep.originalDocumentsLocation || ''}
              onChange={(e) =>
                onUpdatePrep({ ...prep, originalDocumentsLocation: e.target.value })
              }
              placeholder="Location of original signed Will, Waiver & POA (Avoid bank safe deposit boxes)"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
            />
            <input
              type="text"
              value={prep.passwordManagerLocation || ''}
              onChange={(e) => onUpdatePrep({ ...prep, passwordManagerLocation: e.target.value })}
              placeholder="Where password manager recovery key / phone PIN sheet is stored offline"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
            />
            <input
              type="text"
              value={prep.keyContactsNotes || ''}
              onChange={(e) => onUpdatePrep({ ...prep, keyContactsNotes: e.target.value })}
              placeholder="Key contacts: CPA, Financial Advisor, Insurance Agent"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Printable Attorney Briefing Sheet */}
      <div
        id="printable-attorney-packet"
        className="print-container bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* Briefing Sheet Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              Confidential Client Intake &amp; Statutory Instruction Memorandum
            </div>
            <h2 className="text-xl font-bold text-slate-950 mt-0.5">
              New York Blended Family Estate Planning Briefing Packet
            </h2>
          </div>
          <div className="text-xs text-slate-700 sm:text-right space-y-0.5">
            <div>
              <strong>Client:</strong> {will.testatorName || '[Client Name]'} ({will.county} County, NY)
            </div>
            <div>
              <strong>Spouse:</strong> {will.spouseName || '[Spouse Name]'}
            </div>
            <div>
              <strong>Client&apos;s Children:</strong>{' '}
              {will.children.map((c) => c.fullName).filter(Boolean).join(', ')}
            </div>
          </div>
        </div>

        {/* Section A: Mutual Financial Disclosure Summary */}
        <div className="space-y-3 print-avoid-break">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Section A: Mutual Financial Disclosure Summary (Schedules A &amp; B for Postnuptial Waiver)
            </h3>
            <span className="text-xs font-mono text-slate-600">
              NY DRL § 236(B)(3) &amp; EPTL § 5-1.1-A(e)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schedule A: User's Separate Accounts */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Schedule A — {will.testatorName}&apos;s Sole-Name Assets</span>
                <span className="font-mono">{formatCurrency(userTotalAssets)}</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5">Account / Institution</th>
                    <th className="py-1.5 px-2">Mechanism</th>
                    <th className="py-1.5 px-2.5 text-right">Approx. Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {accounts.map((acc) => (
                    <tr key={acc.id}>
                      <td className="py-1.5 px-2.5 font-medium text-slate-900">
                        {acc.nickname}
                        <span className="block text-[10px] text-slate-500">{acc.accountType}</span>
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-slate-700">
                        {acc.transferMechanism === 'None (Probate Asset)'
                          ? 'Probate'
                          : acc.transferMechanism.split(' ')[0]}
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-mono font-semibold text-slate-900">
                        {formatCurrency(acc.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Schedule B: Spouse's Separate Accounts */}
            <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Schedule B — {will.spouseName}&apos;s Separate Assets</span>
                  <span className="font-mono">{formatCurrency(spouseTotalAssets)}</span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5">Account / Asset</th>
                      <th className="py-1.5 px-2">Category</th>
                      <th className="py-1.5 px-2.5 text-right">Approx. Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {prep.spouseAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-2.5 px-3 text-center text-slate-500 italic">
                          No separate spouse accounts disclosed at this time (Schedule B to be reviewed with attorney).
                        </td>
                      </tr>
                    ) : (
                      prep.spouseAccounts.map((sp) => (
                        <tr key={sp.id}>
                          <td className="py-1.5 px-2.5 font-medium text-slate-900">
                            {sp.institution}
                          </td>
                          <td className="py-1.5 px-2 text-[11px] text-slate-600">
                            {sp.accountType}
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-mono font-semibold text-slate-900">
                            {formatCurrency(sp.balance)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600">
                Both spouses acknowledge full and fair disclosure of their respective separate assets, liabilities, and income prior to executing mutual waivers.
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Requested Legal Instruments Checklist */}
        <div className="space-y-3 print-avoid-break">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Section B: Requested New York Legal Instruments Checklist
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Instrument 1: Mutual Waivers of Right of Election */}
            <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/50">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-950">
                      1. Mutual Waivers of Right of Election (<code className="font-mono">EPTL § 5-1.1-A(e)</code>)
                    </span>
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      DRL § 236(B)(3) &amp; RPL § 309-a Deed Form
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Draft a stand-alone Mutual Waiver of Right of Election whereby{' '}
                    <strong>{will.testatorName}</strong> and <strong>{will.spouseName}</strong> each irrevocably waive all rights to elect against the other&apos;s Will or Testamentary Substitutes (including IRAs, TOD brokerage accounts, and POD Totten Trusts) under <code className="font-mono">EPTL § 5-1.1-A</code>, as well as exempt family property rights under <code className="font-mono">EPTL § 5-3.1</code>. Must include: (a) full New York uniform real-estate deed acknowledgment certificates (<code className="font-mono">RPL § 309-a</code>), (b) attached Schedules A &amp; B financial disclosures, and (c) independent legal counsel representation or explicit informed waiver-of-counsel acknowledgment.
                  </p>
                </div>
              </div>
            </div>

            {/* Instrument 2: NY Statutory Short Form Power of Attorney */}
            <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/50">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-950">
                      2. NY Statutory Short Form Power of Attorney (<code className="font-mono">GOL § 5-1513</code>)
                    </span>
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Execution: 2 Disinterested Witnesses + Notary
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-800">
                    <div>
                      <strong>Primary Agent:</strong> {prep.poaPrimaryAgent || '[Primary Agent]'}
                    </div>
                    <div>
                      <strong>Successor Agent:</strong> {prep.poaSuccessorAgent || '[Successor Agent]'}
                    </div>
                    <div>
                      <strong>Co-Agent Rule:</strong> {prep.poaCoAgentRule}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    <strong>Section (g) Gifting Modifications:</strong>{' '}
                    {prep.poaGiftingModifications ? (
                      <span>
                        <strong>Enabled</strong> — {prep.poaGiftingNotes}
                      </span>
                    ) : (
                      <span>
                        <strong>Standard Statutory Cap ($5,000 aggregate annual limit)</strong> — Agent may not alter existing TOD/POD/IRA beneficiary designations.
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-600 italic">
                    Statutory Execution Note: Under NY General Obligations Law § 5-1501B(1)(b), the principal&apos;s signature must be both notarized AND witnessed by two disinterested persons (none of whom are named as agents or permissible gift recipients).
                  </p>
                </div>
              </div>
            </div>

            {/* Instrument 3: NY Health Care Proxy */}
            <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/50 print-avoid-break">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-950">
                      3. NY Health Care Proxy (<code className="font-mono">PHL § 2981</code>)
                    </span>
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      Execution: 2 Adult Witnesses (Non-Agents)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-800">
                    <div>
                      <strong>Primary Health Care Agent:</strong> {prep.hcpPrimaryAgent || '[Primary Agent]'} {prep.hcpPrimaryPhone ? `(${prep.hcpPrimaryPhone})` : ''}
                    </div>
                    <div>
                      <strong>Backup Health Care Agent:</strong> {prep.hcpBackupAgent || '[Backup Agent]'} {prep.hcpBackupPhone ? `(${prep.hcpBackupPhone})` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instrument 4: Living Will & Stand-Alone HIPAA Release */}
            {((prep.requestLivingWill ?? true) || (prep.requestHipaaRelease ?? true)) && (
              <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/50 print-avoid-break">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-950">
                        4. NY Living Will (Advance Directive) &amp; Stand-Alone HIPAA Release
                      </span>
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        Execution: 2 Adult Witnesses
                      </span>
                    </div>
                    {(prep.requestLivingWill ?? true) && (
                      <div className="text-slate-700 space-y-0.5">
                        <div>
                          <strong>End-of-Life Preference:</strong> {prep.livingWillPreference || 'Comfort Care / No Artificial Prolongation'}
                        </div>
                        <div>
                          <strong>Artificial Nutrition &amp; Hydration:</strong> {prep.livingWillArtificialNutrition || 'Withhold / Withdraw if Terminal or Permanent Unconsciousness'}
                        </div>
                      </div>
                    )}
                    {(prep.requestHipaaRelease ?? true) && (
                      <div className="text-slate-700 pt-1 border-t border-slate-200/80">
                        <strong>HIPAA Authorized Recipients (Active Immediately):</strong>{' '}
                        {prep.hipaaAuthorizedPersons || '[Specify Authorized Family Members]'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instrument 5: NY Appointment of Agent to Control Disposition of Remains (PHL § 4201) */}
            {(prep.requestDispositionOfRemains ?? true) && (
              <div className="p-4 rounded-lg border border-amber-300 bg-amber-50/40 print-avoid-break">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-950">
                        5. NY Appointment of Agent to Control Disposition of Remains (<code className="font-mono">PHL § 4201</code>)
                      </span>
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        Overrides Default Spousal Control
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-800">
                      <div>
                        <strong>Primary Funeral/Disposition Agent:</strong> {prep.dispositionPrimaryAgent || '[Primary Agent]'}
                      </div>
                      <div>
                        <strong>Successor Agent:</strong> {prep.dispositionSuccessorAgent || '[Successor Agent]'}
                      </div>
                    </div>
                    {prep.dispositionWishes && (
                      <div className="text-slate-700">
                        <strong>Stated Wishes:</strong> {prep.dispositionWishes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Age 62+ Long-Term Care, Medicaid & Real Estate Review */}
          <div className="space-y-3 pt-4 border-t border-slate-300 print-avoid-break">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Section C: Age 62+ Long-Term Care, Medicaid &amp; Real Estate Discussion Agenda
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50/50 space-y-1">
                <div className="font-bold text-slate-900">
                  Long-Term Care &amp; NY Medicaid Spousal Refusal
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {prep.discussMedicaidSpousalRefusal ?? true
                    ? 'Requested: Review NY 5-year nursing home lookback, Medicaid Asset Protection Trust (MAPT), Long-Term Care Insurance, and NY Spousal Refusal rules to protect each spouse’s separate estate.'
                    : 'Not requested for this consultation.'}
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50/50 space-y-1">
                <div className="font-bold text-slate-900">
                  NY Real Estate Transfer Plan (<code className="font-mono">RPL § 424</code> / Trust)
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {prep.ownsNyRealEstate ? (
                    <>
                      <strong>Selected Strategy:</strong> {prep.realEstatePlanOption || 'NY Transfer on Death Deed (RPL § 424)'}
                      {prep.realEstateNotes ? ` — ${prep.realEstateNotes}` : ''}
                    </>
                  ) : (
                    'No sole-name NY real estate reported at this time.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Section D: Digital Assets (NY EPTL Art. 13-A) & Family Letter of Instruction */}
          <div className="space-y-3 pt-4 border-t border-slate-300 print-avoid-break">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Section D: Digital Assets (<code className="font-mono">EPTL Art. 13-A</code>) &amp; Family Letter of Instruction
            </h3>
            <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/50 text-xs space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2 border-b border-slate-200">
                <div><strong>RUFADAA Clause:</strong> {(prep.includeDigitalAssetsClause ?? true) ? 'Yes' : 'No'}</div>
                <div><strong>Apple Legacy:</strong> {prep.appleLegacyContactSet ? 'Set' : 'Pending'}</div>
                <div><strong>Google Inactive:</strong> {prep.googleInactiveManagerSet ? 'Set' : 'Pending'}</div>
                <div><strong>Custodian PDFs:</strong> {prep.beneficiaryAuditVerified ? 'Verified' : 'Pending'}</div>
              </div>
              <div className="space-y-1 text-slate-700">
                <div>
                  <strong>Original Wet-Ink Documents Location:</strong>{' '}
                  {prep.originalDocumentsLocation || '[Specify safe home location — avoid bank safe deposit boxes]'}
                </div>
                <div>
                  <strong>Password Manager / Device Access Key Location:</strong>{' '}
                  {prep.passwordManagerLocation || '[Specify offline location of recovery key — never store passwords in this packet]'}
                </div>
                {prep.keyContactsNotes && (
                  <div>
                    <strong>Key Advisors (CPA / Financial / Insurance):</strong> {prep.keyContactsNotes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
