import React from 'react';
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  Clock,
  Sliders,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AssetAccount, ElectiveShareConfig } from '../types';
import { SectionHelpBanner } from './SectionHelpBanner';

interface ElectiveShareTabProps {
  accounts: AssetAccount[];
  config: ElectiveShareConfig;
  spouseName: string;
  onUpdateConfig: (config: ElectiveShareConfig) => void;
  onNavigateToAttorneyPrep: () => void;
  onOpenHelp?: () => void;
}

export const ElectiveShareTab: React.FC<ElectiveShareTabProps> = ({
  accounts,
  config,
  spouseName,
  onUpdateConfig,
  onNavigateToAttorneyPrep,
  onOpenHelp,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  // Auto-calculated totals from Tab 1
  const autoProbateAssets = accounts
    .filter((a) => a.transferMechanism === 'None (Probate Asset)')
    .reduce((sum, a) => sum + a.balance, 0);

  const autoTestamentarySubstitutes = accounts
    .filter((a) => a.transferMechanism !== 'None (Probate Asset)')
    .reduce((sum, a) => sum + a.balance, 0);

  const probateAssets = config.useManualOverride
    ? config.manualProbateAssets
    : autoProbateAssets;

  const testamentarySubstitutes = config.useManualOverride
    ? config.manualTestamentarySubstitutes
    : autoTestamentarySubstitutes;

  const grossEstate = probateAssets + testamentarySubstitutes;
  const expenses = Math.max(0, config.estimatedExpenses || 0);

  // Net Elective Estate = (Probate Assets + Testamentary Substitutes) - Expenses
  const netElectiveEstate = Math.max(0, grossEstate - expenses);

  // Statutory Elective Share = Greater of $50,000 or 1/3 (33.33%) of Net Elective Estate (capped at 100% if under $50,000)
  const oneThirdShare = netElectiveEstate / 3;
  const statutoryElectiveShare =
    netElectiveEstate === 0 ? 0 : Math.min(netElectiveEstate, Math.max(50000, oneThirdShare));

  const childrenNetWithoutWaiver = Math.max(0, netElectiveEstate - statutoryElectiveShare);
  const childrenSharePercentWithoutWaiver =
    netElectiveEstate > 0
      ? ((childrenNetWithoutWaiver / netElectiveEstate) * 100).toFixed(1)
      : '0.0';
  const spousalClaimPercent =
    netElectiveEstate > 0
      ? ((statutoryElectiveShare / netElectiveEstate) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      <SectionHelpBanner
        sectionTitle="Section 2 Guide: Understanding New York's 1/3 Spousal Right of Election"
        plainEnglishSummary="Many married New Yorkers assume that if they keep all accounts in their sole name and name their children as TOD/POD/IRA beneficiaries, 100% will go to their children. In New York, that is FALSE unless your spouse signs a formal written waiver. Under NY EPTL § 5-1.1-A, your spouse (or their Power of Attorney, guardian, or Medicaid if they ever need nursing home care) can claim 1/3 of your combined estate—clawing it back directly from your children's inherited IRAs and TOD/POD accounts."
        steps={[
          {
            stepNumber: 1,
            title: 'Verify Your Auto-Pulled Estate Totals',
            detail:
              'Your Probate Assets and Testamentary Substitutes (IRAs, TOD, POD) are automatically pulled from Tab 1. You can check "Manual Override" to test different what-if numbers.',
          },
          {
            stepNumber: 2,
            title: 'Enter Estimated Funeral, Debt & Admin Expenses',
            detail:
              'Enter approximate final expenses (e.g., $15,000–$25,000). New York deducts these before computing the 1/3 spousal share.',
          },
          {
            stepNumber: 3,
            title: 'Compare Scenario A vs. Scenario B Below',
            detail:
              'Review Scenario A to see the exact dollar amount clawed back from each account without a waiver, and Scenario B to see how a Deed-Acknowledged Mutual Waiver (EPTL § 5-1.1-A(e)) reduces the spousal claim to $0.',
          },
        ]}
        keyTerms={[
          {
            term: 'Right of Election (EPTL § 5-1.1-A)',
            definition:
              'A surviving spouse’s statutory right in New York to take the greater of $50,000 or 1/3 (33.33%) of your Net Elective Estate.',
          },
          {
            term: 'Testamentary Substitutes',
            definition:
              'Non-probate accounts (IRAs, 401(k)s, TOD brokerage, POD bank accounts) that New York law still counts when calculating the 1/3 spousal share.',
          },
          {
            term: 'Pro-Rata Clawback',
            definition:
              'If an election is filed, every beneficiary of your IRAs, TODs, PODs, and Will must contribute their proportional share to pay the spouse’s 1/3 claim.',
          },
          {
            term: 'Deed-Acknowledged Waiver (EPTL § 5-1.1-A(e))',
            definition:
              'A written agreement signed by your spouse in front of a Notary Public using New York real-estate deed wording that permanently waives the 1/3 claim.',
          },
        ]}
        onOpenFullHelp={onOpenHelp}
      />
      {/* Educational Statutory Callout Banner */}
      <div className="bg-[#0F172A] text-white rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-semibold">
              <Scale className="w-3.5 h-3.5" /> NY EPTL § 5-1.1-A — Right of Election by Surviving Spouse
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Why TOD, POD &amp; IRA Beneficiaries Alone Cannot Disinherit a Spouse in New York
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              Under New York <code className="text-amber-300 font-mono">EPTL § 5-1.1-A(b)(1)</code>, a surviving spouse cannot be disinherited without a formal written waiver—even if you hold <strong>zero joint assets</strong> and leave $0 in your Will. New York law sweeps your sole-name{' '}
              <strong>Traditional/Roth IRAs, 401(k)s, TOD brokerage accounts, and POD (Totten Trust) bank accounts</strong> back into your &ldquo;Net Estate&rdquo; as{' '}
              <strong className="text-white underline decoration-amber-400">Testamentary Substitutes</strong>, allowing the spouse (or their Power of Attorney agent, guardian, or Medicaid) to claw back <strong>1/3 of the combined net estate</strong> pro-rata from your children.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Inputs & Live Formula Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Inputs */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-700" />
              <h3 className="text-base font-bold text-slate-900">
                Elective Share Calculator Inputs
              </h3>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                id="toggle-manual-override"
                type="checkbox"
                checked={config.useManualOverride}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    useManualOverride: e.target.checked,
                    manualProbateAssets: config.useManualOverride
                      ? config.manualProbateAssets
                      : autoProbateAssets,
                    manualTestamentarySubstitutes: config.useManualOverride
                      ? config.manualTestamentarySubstitutes
                      : autoTestamentarySubstitutes,
                  })
                }
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              Manual Override
            </label>
          </div>

          {/* Total Probate Assets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="input-probate-assets"
                className="text-xs font-semibold text-slate-700"
              >
                Total Probate Assets (Sole Name, No TOD/POD)
              </label>
              {!config.useManualOverride && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Auto-pulled from Tab 1
                </span>
              )}
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="input-probate-assets"
                type="number"
                min="0"
                step="500"
                disabled={!config.useManualOverride}
                value={probateAssets}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    manualProbateAssets: Number(e.target.value) || 0,
                  })
                }
                className={`w-full pl-8 pr-3 py-2 rounded-lg border text-sm font-mono ${
                  config.useManualOverride
                    ? 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Total Testamentary Substitutes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="input-testamentary-substitutes"
                className="text-xs font-semibold text-slate-700"
              >
                Total Testamentary Substitutes (IRAs, TOD, POD)
              </label>
              {!config.useManualOverride && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Auto-pulled from Tab 1
                </span>
              )}
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="input-testamentary-substitutes"
                type="number"
                min="0"
                step="1000"
                disabled={!config.useManualOverride}
                value={testamentarySubstitutes}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    manualTestamentarySubstitutes: Number(e.target.value) || 0,
                  })
                }
                className={`w-full pl-8 pr-3 py-2 rounded-lg border text-sm font-mono ${
                  config.useManualOverride
                    ? 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Includes Traditional/Roth IRAs, 401(k), TOD brokerage, and POD Totten Trust accounts under <code className="font-mono">EPTL § 5-1.1-A(b)(1)(F)-(G)</code>.
            </p>
          </div>

          {/* Estimated Debts, Funeral & Administration Expenses */}
          <div>
            <label
              htmlFor="input-estimated-expenses"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Estimated Debts, Funeral &amp; Administration Expenses ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="input-estimated-expenses"
                type="number"
                min="0"
                step="500"
                value={config.estimatedExpenses}
                onChange={(e) =>
                  onUpdateConfig({
                    ...config,
                    estimatedExpenses: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deductible under <code className="font-mono">EPTL § 5-1.1-A(a)(2)</code> (estate taxes are disregarded).
            </p>
          </div>
        </div>

        {/* Right: Statutory Formula Ledger */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              New York <code className="font-mono text-sm">EPTL § 5-1.1-A</code> Statutory Computation
            </h3>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">1. Sole-Name Probate Assets</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCurrency(probateAssets)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">
                  2. Plus: Testamentary Substitutes (IRAs, TOD, POD)
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  + {formatCurrency(testamentarySubstitutes)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">
                  3. Less: Enforceable Debts, Funeral &amp; Admin Expenses
                </span>
                <span className="font-mono font-semibold text-rose-700">
                  - {formatCurrency(expenses)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-100 font-bold text-slate-900">
                <span>Net Elective Estate (Probate + Substitutes - Expenses)</span>
                <span id="readout-net-elective-estate" className="font-mono text-base">
                  {formatCurrency(netElectiveEstate)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                <div>
                  <div className="font-bold">
                    Statutory Elective Share (Greater of $50,000 or 1/3 of Net Estate)
                  </div>
                  <div className="text-xs text-amber-800">
                    Capped at 100% of Net Elective Estate if total estate is under $50,000
                  </div>
                </div>
                <span id="readout-statutory-elective-share" className="font-mono text-lg font-bold text-red-700">
                  {formatCurrency(statutoryElectiveShare)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Strict Filing Deadline (<code className="font-mono">EPTL § 5-1.1-A(d)(1)</code>):</strong> Election must be filed within{' '}
              <strong>6 months</strong> of the issuance of Letters Testamentary/Administration, and no later than{' '}
              <strong>2 years</strong> after the date of death.
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards: Scenario A vs Scenario B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario A: Without Written Spousal Waiver */}
        <div
          id="card-scenario-a"
          className="bg-white rounded-xl border-2 border-red-300 shadow-sm overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="bg-red-50 border-b border-red-200 px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-red-600 text-white">
                  Scenario A • Unprotected Default
                </span>
                <h3 className="text-base sm:text-lg font-bold text-red-950 mt-1.5">
                  Without Written Spousal Waiver
                </h3>
                <p className="text-xs text-red-800 mt-0.5">
                  Even if your spouse verbally agrees today, a future Power of Attorney agent, court-appointed guardian, or NY Medicaid agency can force this claim.
                </p>
              </div>
              <ShieldAlert className="w-7 h-7 text-red-600 shrink-0" />
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200">
                  <div className="text-xs font-semibold text-red-800">
                    Spousal Elective Claim ({spousalClaimPercent}%)
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-red-700 mt-1">
                    {formatCurrency(statutoryElectiveShare)}
                  </div>
                  <div className="text-[11px] text-red-700 mt-0.5">
                    Clawed back from children&apos;s accounts
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700">
                    Remaining to Children ({childrenSharePercentWithoutWaiver}%)
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                    {formatCurrency(childrenNetWithoutWaiver)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Reduced by 1/3 statutory share
                  </div>
                </div>
              </div>

              {/* Pro-Rata Clawback Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Pro-Rata Clawback from Children&apos;s Inherited Accounts (<code className="font-mono">EPTL § 5-1.1-A(c)(2)</code>)
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Account</th>
                        <th className="py-2 px-3 text-right">Balance</th>
                        <th className="py-2 px-3 text-right text-red-700">Spousal Clawback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {accounts.map((acc) => {
                        const shareOfGross =
                          grossEstate > 0 ? acc.balance / grossEstate : 0;
                        const clawbackAmount = statutoryElectiveShare * shareOfGross;
                        return (
                          <tr key={acc.id}>
                            <td className="py-2 px-3 font-medium text-slate-800 truncate max-w-[180px]">
                              {acc.nickname}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-600">
                              {formatCurrency(acc.balance)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-red-700">
                              -{formatCurrency(clawbackAmount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Medicaid Nursing Home Trap:</strong> In New York, if {spouseName || 'your surviving spouse'} later requires Medicaid long-term care, the local Department of Social Services (DSS) treats failure to exercise the 1/3 Right of Election as an uncompensated asset transfer—forcing a claim against your children&apos;s inherited IRAs and TOD/POD accounts.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Separate Trap — Family Exempt Property (<code className="font-mono">EPTL § 5-3.1</code>):</strong> Completely <em>independent</em> of the 1/3 Right of Election, NY law awards a surviving spouse up to <strong>$25,000 in cash/equivalents</strong>, <strong>1 motor vehicle up to $25,000</strong>, and <strong>$20,000 in household furniture/appliances</strong> off the top of your estate—unless <strong>explicitly waived</strong> by statute in your Mutual Waiver.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario B: With Deed-Acknowledged Mutual Waiver (EPTL § 5-1.1-A(e) & EPTL § 5-3.1) */}
        <div
          id="card-scenario-b"
          className="bg-white rounded-xl border-2 border-emerald-500 shadow-sm overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-emerald-700 text-white">
                  Scenario B • Gold-Standard Protection
                </span>
                <h3 className="text-base sm:text-lg font-bold text-emerald-950 mt-1.5">
                  With Deed-Acknowledged Mutual Waiver (<code className="font-mono text-sm">EPTL § 5-1.1-A(e)</code> &amp; <code className="font-mono text-sm">§ 5-3.1</code>)
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Both spouses explicitly waive BOTH the Right of Election AND Family Exempt Property (<code className="font-mono">EPTL § 5-3.1</code>) in a deed-acknowledged agreement.
                </p>
              </div>
              <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600">
                    Spousal Elective Claim (0%)
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-700 mt-1">
                    $0
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Legally waived under EPTL § 5-1.1-A(e)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300">
                  <div className="text-xs font-semibold text-emerald-900">
                    Passing to Your Children (100%)
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 mt-1">
                    {formatCurrency(netElectiveEstate)}
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    100% protected for your children
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">
                  Statutory Requirements for a Valid NY Waiver (<code className="font-mono">EPTL § 5-1.1-A(e)(2)</code>):
                </h4>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>In Writing &amp; Subscribed:</strong> Must be in writing and signed by the waiving spouse (or mutually by both spouses so each spouse&apos;s children are protected).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Real Property Deed Acknowledgment (<code className="font-mono">RPL § 309-a</code> / <code className="font-mono">DRL § 236(B)(3)</code>):</strong> A simple notary stamp is insufficient—it must include the full New York uniform real-estate certificate of acknowledgment.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Protects Direct Transfers:</strong> Combined with your TOD/POD and IRA beneficiary designations, your children receive <strong>{formatCurrency(netElectiveEstate)} (100%)</strong> outside of probate and immune from elective share claims.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0">
            <button
              type="button"
              onClick={onNavigateToAttorneyPrep}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Prepare Mutual Waiver Briefing in Tab 4 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
