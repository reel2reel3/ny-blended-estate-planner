import React from 'react';
import {
  Printer,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ExecutionChecklist, WillConfig } from '../types';
import { NY_COUNTIES } from '../defaultState';
import { SectionHelpBanner } from './SectionHelpBanner';

interface BackupWillTabProps {
  will: WillConfig;
  onUpdateWill: (will: WillConfig) => void;
  onOpenHelp?: () => void;
}

export const BackupWillTab: React.FC<BackupWillTabProps> = ({
  will,
  onUpdateWill,
  onOpenHelp,
}) => {
  const handleAddChild = () => {
    onUpdateWill({
      ...will,
      children: [
        ...will.children,
        { id: `child-${Date.now()}`, fullName: '' },
      ],
    });
  };

  const handleRemoveChild = (id: string) => {
    onUpdateWill({
      ...will,
      children: will.children.filter((c) => c.id !== id),
    });
  };

  const handleChildNameChange = (id: string, fullName: string) => {
    onUpdateWill({
      ...will,
      children: will.children.map((c) => (c.id === id ? { ...c, fullName } : c)),
    });
  };

  const toggleChecklist = (key: keyof ExecutionChecklist) => {
    onUpdateWill({
      ...will,
      executionChecklist: {
        ...will.executionChecklist,
        [key]: !will.executionChecklist[key],
      },
    });
  };

  const completedChecks = Object.values(will.executionChecklist).filter(Boolean).length;

  const formattedChildrenNames =
    will.children
      .map((c) => c.fullName.trim())
      .filter(Boolean)
      .join(', ') || '[Names of Children]';

  const handlePrintWill = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <SectionHelpBanner
        sectionTitle="Section 3 Guide: Creating & Signing Your New York Backup Will"
        plainEnglishSummary="Even when 95%+ of your money passes directly to your children via IRAs, TOD, and POD, you still need a 'Backup Will' to catch your small non-POD checking buffer (<$50,000), your car, jewelry, household items, or any unexpected tax refund. Without a Will ('intestacy' under NY EPTL § 4-1.1), your surviving spouse automatically takes the first $50,000 PLUS half of all remaining probate assets!"
        steps={[
          {
            stepNumber: 1,
            title: 'Fill In Your Family & Executor Details on the Left',
            detail:
              'Enter your full legal name, NY county, spouse’s full legal name (so Article I explicitly records that omitting your spouse from the Will is intentional), your children’s full names, and name one child as Primary Executor and a second child as Successor Executor.',
          },
          {
            stepNumber: 2,
            title: 'Click "Print / Save as PDF" to Print on Standard Letter Paper',
            detail:
              'Do NOT sign digitally and do NOT make any handwritten changes on the printed pages. Staple the pages together before signing and never remove the staple.',
          },
          {
            stepNumber: 3,
            title: 'Sign in Front of 2 Unrelated Witnesses + a NY Notary Public',
            detail:
              'Bring two adult witnesses who are NOT your children or spouse (e.g., neighbors or friends) to a Notary Public. Sign at the physical end of the Will, declare it is your Will, have both witnesses sign and write their street addresses, and have the Notary complete the SCPA § 1406 Self-Proving Affidavit on the last page.',
          },
          {
            stepNumber: 4,
            title: 'Check Off the 5 Execution Guardrails at the Bottom',
            detail:
              'Use the interactive 5-step checklist below the editor to confirm every New York EPTL § 3-2.1 requirement was satisfied.',
          },
        ]}
        keyTerms={[
          {
            term: 'Intentional Omission Clause (Article I)',
            definition:
              'Explicitly naming your spouse and stating they are omitted by mutual agreement prevents any claim of accidental oversight.',
          },
          {
            term: 'Disinterested Witnesses (EPTL § 3-3.2)',
            definition:
              'Witnesses who receive $0 under the Will. If a child witnesses your Will, their gift under the Will is legally voided!',
          },
          {
            term: 'Self-Proving Affidavit (SCPA § 1406)',
            definition:
              'The notarized witness statement on the final page so your witnesses never have to be tracked down or appear in court after your death.',
          },
          {
            term: 'Waiver of Fiduciary Bond',
            definition:
              'Saves your children from paying expensive insurance company bond premiums to serve as your Executor.',
          },
        ]}
        onOpenFullHelp={onOpenHelp}
      />
      {/* Split-Screen Editor: Left Structured Inputs, Right Live Legal Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Structured Form Inputs (Hidden when printing) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 no-print">
          <div className="border-b border-slate-200 pb-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-900 text-white">
              NY EPTL § 3-2.1 &amp; SCPA § 1406
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1.5">
              Backup Will Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Catches your non-POD checking buffer (&lt;$50k), personal property, automobiles, or unexpected refunds and directs them 100% to your children.
            </p>
          </div>

          {/* Testator Name & NY County */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="input-testator-name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Testator Full Legal Name
              </label>
              <input
                id="input-testator-name"
                type="text"
                value={will.testatorName}
                onChange={(e) => onUpdateWill({ ...will, testatorName: e.target.value })}
                placeholder="e.g., Robert J. Vance"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="select-ny-county"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                New York County of Residence
              </label>
              <select
                id="select-ny-county"
                value={will.county}
                onChange={(e) => onUpdateWill({ ...will, county: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {NY_COUNTIES.map((county) => (
                  <option key={county} value={county}>
                    {county} County
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Spouse Full Legal Name */}
          <div>
            <label
              htmlFor="input-spouse-name"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Spouse Full Legal Name (For Intentional Omission Clause)
            </label>
            <input
              id="input-spouse-name"
              type="text"
              value={will.spouseName}
              onChange={(e) => onUpdateWill({ ...will, spouseName: e.target.value })}
              placeholder="e.g., Evelyn M. Vance"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Explicitly naming your spouse in Article I proves the omission is intentional rather than a drafting oversight.
            </p>
          </div>

          {/* Children's Full Legal Names */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Children&apos;s Full Legal Names (Equal Shares)
              </label>
              <button
                type="button"
                onClick={handleAddChild}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Child
              </button>
            </div>

            {will.children.length === 0 ? (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-center">
                <p className="text-xs text-slate-500 mb-2">No children entered yet.</p>
                <button
                  type="button"
                  onClick={handleAddChild}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Child
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {will.children.map((child, idx) => (
                  <div key={child.id} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={child.fullName}
                      onChange={(e) => handleChildNameChange(child.id, e.target.value)}
                      placeholder={`Child ${idx + 1} Full Legal Name`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(child.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                      title="Remove child"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Per Stirpes Toggle */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Residuary Distribution Standard
              </div>
              <div className="text-[11px] text-slate-500">
                Equal shares to children, <span className="italic">per stirpes</span> (<code className="font-mono">EPTL § 1-2.14</code>)
              </div>
            </div>
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => onUpdateWill({ ...will, perStirpes: true })}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  will.perStirpes ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                }`}
              >
                Per Stirpes (Yes)
              </button>
              <button
                type="button"
                onClick={() => onUpdateWill({ ...will, perStirpes: false })}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  !will.perStirpes ? 'bg-amber-600 text-white' : 'text-slate-600'
                }`}
              >
                Per Capita (No)
              </button>
            </div>
          </div>

          {/* Primary & Successor Executor */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="input-primary-executor"
                  className="text-xs font-semibold text-slate-700"
                >
                  Primary Executor (Recommend Naming One Child)
                </label>
                {will.children[0]?.fullName && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateWill({ ...will, primaryExecutor: will.children[0].fullName })
                    }
                    className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                  >
                    Use {will.children[0].fullName.split(' ')[0]}
                  </button>
                )}
              </div>
              <input
                id="input-primary-executor"
                type="text"
                value={will.primaryExecutor}
                onChange={(e) => onUpdateWill({ ...will, primaryExecutor: e.target.value })}
                placeholder="Primary Executor Full Legal Name"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="input-successor-executor"
                  className="text-xs font-semibold text-slate-700"
                >
                  Successor Executor (Recommend Naming Second Child)
                </label>
                {will.children[1]?.fullName && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateWill({ ...will, successorExecutor: will.children[1].fullName })
                    }
                    className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                  >
                    Use {will.children[1].fullName.split(' ')[0]}
                  </button>
                )}
              </div>
              <input
                id="input-successor-executor"
                type="text"
                value={will.successorExecutor}
                onChange={(e) => onUpdateWill({ ...will, successorExecutor: e.target.value })}
                placeholder="Successor Executor Full Legal Name"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Formatted Legal Document Preview */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar above Preview */}
          <div className="bg-[#0F172A] text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold">
                  Live New York Statutory Will &amp; Self-Proving Affidavit Preview
                </h3>
                <p className="text-xs text-slate-300">
                  Formatted for US Letter paper with dedicated <code className="text-amber-300">@media print</code> page breaks
                </p>
              </div>
            </div>
            <button
              id="btn-print-will"
              type="button"
              onClick={handlePrintWill}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
          </div>

          {/* Printable Legal Instrument Sheet */}
          <div
            id="printable-will-document"
            className="print-container bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-10 font-legal text-slate-950 leading-relaxed space-y-5"
          >
            {/* Title & Preamble */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider">
                Last Will and Testament
              </h2>
              <p className="text-sm font-bold uppercase tracking-wide mt-1">
                of {will.testatorName || '[TESTATOR FULL LEGAL NAME]'}
              </p>
            </div>

            <p className="text-sm text-justify">
              I, <strong>{will.testatorName || '[TESTATOR FULL LEGAL NAME]'}</strong>, residing and domiciled in the County of{' '}
              <strong>{will.county || '[COUNTY]'}</strong>, State of New York, being of sound and disposing mind and memory, do hereby make, publish, and declare this instrument to be my Last Will and Testament, and pursuant to New York Estates, Powers and Trusts Law (<code className="font-mono text-xs">EPTL § 3-4.1</code>), I hereby expressly revoke all former wills and codicils by me at any time heretofore made.
            </p>

            {/* Article I: Family & Intentional Omission */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-sm font-bold uppercase tracking-wide underline">
                Article I — Family Identification &amp; Intentional Omission of Spouse
              </h3>
              <p className="text-sm text-justify">
                <strong>Section 1.01. Identification of Family.</strong> I am married to{' '}
                <strong>{will.spouseName || '[SPOUSE FULL LEGAL NAME]'}</strong>. I have{' '}
                {will.children.length > 0 ? will.children.length : '[NUMBER]'}{' '}
                {will.children.length === 1 ? 'child' : 'children'} from a prior relationship, namely:{' '}
                <strong>{formattedChildrenNames}</strong>. All references in this Will to &ldquo;my children&rdquo; are to the aforesaid named children.
              </p>
              <p className="text-sm text-justify">
                <strong>Section 1.02. Intentional Omission of Spouse.</strong> I have intentionally, and not as a result of mistake, accident, or oversight, made no financial provision in this Will for my spouse,{' '}
                <strong>{will.spouseName || '[SPOUSE FULL LEGAL NAME]'}</strong>, in accordance with our mutual understanding and agreement to maintain separate estates for the benefit of our respective children, and in contemplation of our mutual waivers of the spousal right of election executed pursuant to New York{' '}
                <code className="font-mono text-xs">EPTL § 5-1.1-A(e)</code>.
              </p>
            </div>

            {/* Article II: Debts & Final Expenses */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-sm font-bold uppercase tracking-wide underline">
                Article II — Payment of Debts &amp; Funeral Expenses
              </h3>
              <p className="text-sm text-justify">
                I direct my Executor, hereinafter named, to pay all of my legally enforceable debts, funeral expenses, and the reasonable expenses of the administration of my estate as soon after my death as may be practicable out of my residuary probate estate.
              </p>
            </div>

            {/* Article III: Personal Property & Residuary Estate */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-sm font-bold uppercase tracking-wide underline">
                Article III — Tangible Personal Property &amp; Residuary Estate
              </h3>
              <p className="text-sm text-justify">
                I give, devise, and bequeath all of my tangible personal property (including any motor vehicles, household effects, jewelry, and personal effects) and all the rest, residue, and remainder of my property and estate, both real and personal, of whatsoever kind and wheresoever situated, which I may own or to which I may be entitled at the time of my death (my &ldquo;Residuary Estate&rdquo;), in equal shares to my children,{' '}
                <strong>{formattedChildrenNames}</strong>,{' '}
                <strong>
                  {will.perStirpes
                    ? 'per stirpes (pursuant to New York EPTL § 1-2.14)'
                    : 'or evenly to the survivor(s) of them (per capita)'}
                </strong>
                .
              </p>
            </div>

            {/* Article IV: Executor & Powers */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-sm font-bold uppercase tracking-wide underline">
                Article IV — Appointment of Executor &amp; Fiduciary Powers
              </h3>
              <p className="text-sm text-justify">
                <strong>Section 4.01. Appointment.</strong> I hereby nominate, constitute, and appoint{' '}
                <strong>{will.primaryExecutor || '[PRIMARY EXECUTOR NAME]'}</strong> as Executor of this my Last Will and Testament. If{' '}
                <strong>{will.primaryExecutor || '[PRIMARY EXECUTOR NAME]'}</strong> shall predecease me, fail to qualify, resign, or cease to act for any reason, I nominate, constitute, and appoint{' '}
                <strong>{will.successorExecutor || '[SUCCESSOR EXECUTOR NAME]'}</strong> as Successor Executor.
              </p>
              <p className="text-sm text-justify">
                <strong>Section 4.02. Waiver of Bond &amp; Statutory Powers.</strong> I direct that no Executor or Successor Executor named herein shall be required to furnish any bond, undertaking, or other security in the State of New York or in any other jurisdiction for the faithful performance of fiduciary duties. In addition to all powers granted by law, I grant to my Executor all discretionary powers conferred upon fiduciaries under the New York Fiduciaries&apos; Powers Act (<code className="font-mono text-xs">EPTL § 11-1.1</code>), including the power to sell, liquidate, or distribute estate property in cash or in kind without court order, and to administer my estate by Voluntary Administration under <code className="font-mono text-xs">SCPA Article 13</code> if eligible.
              </p>
            </div>

            {/* Signature Block at Physical End (EPTL § 3-2.1) */}
            <div className="pt-4 border-t border-slate-300 space-y-5 print-avoid-break">
              <p className="text-sm text-justify">
                <strong>IN WITNESS WHEREOF</strong>, I,{' '}
                <strong>{will.testatorName || '[TESTATOR FULL LEGAL NAME]'}</strong>, have hereunto subscribed my name at the physical end of this my Last Will and Testament (<code className="font-mono text-xs">EPTL § 3-2.1(a)(1)</code>) on this ________ day of ________________________, 20______.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="border-b border-slate-900 h-7" />
                  <div className="text-xs font-bold mt-1">
                    Date of Execution
                  </div>
                </div>
                <div>
                  <div className="border-b border-slate-900 h-7" />
                  <div className="text-xs font-bold mt-1">
                    {will.testatorName || '[TESTATOR FULL LEGAL NAME]'}, Testator (L.S.)
                  </div>
                </div>
              </div>

              {/* Attestation Clause */}
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-center">
                  Attestation Clause of Disinterested Witnesses (<code className="font-mono">EPTL § 3-2.1</code>)
                </h4>
                <p className="text-xs text-justify leading-relaxed">
                  The foregoing instrument was on the date thereof subscribed at the physical end thereof by the Testator,{' '}
                  <strong>{will.testatorName || '[TESTATOR FULL LEGAL NAME]'}</strong>, in our presence (or acknowledged by the Testator to have been so subscribed), and at the same time the Testator declared the said instrument to be the Testator&apos;s Last Will and Testament, whereupon we, at the Testator&apos;s request, in the Testator&apos;s presence, and in the presence of each other, have hereunto subscribed our names and written our respective places of residence as attesting witnesses within a thirty (30) day period, hereby certifying that neither of us is a spouse, child, or beneficiary under this Will (<code className="font-mono">EPTL § 3-3.2</code>).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
                  {/* Witness 1 */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="border-b border-slate-900 h-6" />
                      <div className="mt-1 font-semibold">Witness #1 Signature</div>
                    </div>
                    <div>
                      <div className="border-b border-slate-900 h-6" />
                      <div className="mt-1 font-semibold">Witness #1 Printed Name</div>
                    </div>
                    <div>
                      <div className="border-b border-slate-900 h-6" />
                      <div className="border-b border-slate-900 h-6 mt-1" />
                      <div className="mt-1 font-semibold">
                        Witness #1 Complete Residential Address (Required by EPTL § 3-2.1(a)(4))
                      </div>
                    </div>
                  </div>

                  {/* Witness 2 */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="border-b border-slate-900 h-6" />
                      <div className="mt-1 font-semibold">Witness #2 Signature</div>
                    </div>
                    <div>
                      <div className="border-b border-slate-900 h-6" />
                      <div className="mt-1 font-semibold">Witness #2 Printed Name</div>
                    </div>
                    <div>
                      <div className="border-b border-slate-900 h-6" />
                      <div className="border-b border-slate-900 h-6 mt-1" />
                      <div className="mt-1 font-semibold">
                        Witness #2 Complete Residential Address (Required by EPTL § 3-2.1(a)(4))
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Break + SCPA § 1406 Self-Proving Affidavit */}
            <div className="print-page-break pt-8 border-t-2 border-dashed border-slate-300 space-y-4 print-avoid-break">
              <div className="text-center">
                <h3 className="text-base font-bold uppercase tracking-wide">
                  Self-Proving Affidavit of Attesting Witnesses
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 mt-0.5">
                  Pursuant to New York Surrogate&apos;s Court Procedure Act (SCPA) § 1406
                </p>
              </div>

              <div className="text-xs font-bold space-y-0.5">
                <div>STATE OF NEW YORK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) ss.:</div>
                <div>COUNTY OF {(will.county || '[COUNTY]').toUpperCase()} &nbsp;&nbsp;)</div>
              </div>

              <p className="text-xs text-justify leading-relaxed">
                Each of the undersigned, individually and severally being duly sworn, deposes and says:
                The within Will was subscribed in our presence and sight at the physical end thereof by{' '}
                <strong>{will.testatorName || '[TESTATOR FULL LEGAL NAME]'}</strong>, the within named Testator, on the ________ day of ________________________, 20______, at ________________________________________________, in the County of{' '}
                <strong>{will.county || '[COUNTY]'}</strong>, State of New York.
              </p>

              <p className="text-xs text-justify leading-relaxed">
                Said Testator at the time of making such subscription declared the instrument so subscribed to be the Testator&apos;s Last Will and Testament. Each of the undersigned thereupon signed his or her name as a witness at the physical end of said Will at the request of the Testator and in the Testator&apos;s presence and sight and in the presence and sight of each other.
              </p>

              <p className="text-xs text-justify leading-relaxed">
                Said Testator was, at the time of so executing said Will, over the age of eighteen (18) years, and, in the respective opinions of the undersigned, of sound mind, memory, and understanding, not under any restraint or in any respect incompetent to make a Will, and could read, write, and converse in the English language, and was not suffering from any defect of sight, hearing, or speech, or from any other physical or mental impairment which would affect capacity to make a valid Will. The Will was executed as a single, original instrument and was not executed in counterparts. Each of the undersigned was acquainted with said Testator at such time and makes this affidavit at the Testator&apos;s request.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
                <div>
                  <div className="border-b border-slate-900 h-7" />
                  <div className="mt-1 font-semibold">Witness #1 Signature (Affiant)</div>
                </div>
                <div>
                  <div className="border-b border-slate-900 h-7" />
                  <div className="mt-1 font-semibold">Witness #2 Signature (Affiant)</div>
                </div>
              </div>

              <div className="pt-4 text-xs space-y-3">
                <p>
                  Severally sworn to and subscribed before me this ________ day of ________________________, 20______.
                </p>
                <div className="max-w-xs pt-3">
                  <div className="border-b border-slate-900 h-7" />
                  <div className="mt-1 font-bold">
                    Notary Public, State of New York
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    (Affix Official Notary Stamp / Commission Expiration)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Execution Guardrails Checklist (Below Editor) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Interactive NY Will Execution Guardrails Checklist (<code className="font-mono text-sm">EPTL § 3-2.1</code>)
              </h3>
              <p className="text-xs text-slate-500">
                New York Surrogate&apos;s Courts strictly enforce ceremony formalities. Verify all 5 statutory steps when signing.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              completedChecks === 5
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {completedChecks} / 5 Guardrails Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {[
            {
              key: 'printedCleanly' as const,
              step: 'Step 1',
              title: 'Printed Cleanly on Paper',
              desc: 'Printed on standard physical paper with zero handwritten edits, cross-outs, or removed staples.',
            },
            {
              key: 'signedAtEnd' as const,
              step: 'Step 2',
              title: 'Signed at Physical End',
              desc: 'Testator signs at the physical end of the Will (EPTL § 3-2.1(a)(1)) and declares it is their Last Will.',
            },
            {
              key: 'twoDisinterestedWitnesses' as const,
              step: 'Step 3',
              title: 'Two Disinterested Witnesses',
              desc: 'Neither your spouse nor any child/beneficiary may witness—otherwise their gift is voided under EPTL § 3-3.2.',
            },
            {
              key: 'witnessesAddresses30Days' as const,
              step: 'Step 4',
              title: 'Witnesses Sign + Addresses (<30d)',
              desc: 'Both witnesses sign and write their full residential addresses within 30 days of each other (EPTL § 3-2.1(a)(4)).',
            },
            {
              key: 'selfProvingNotarized' as const,
              step: 'Step 5',
              title: 'Self-Proving Affidavit Notarized',
              desc: 'SCPA § 1406 Witness Affidavit signed and notarized before a NY Notary Public so witnesses never have to appear in court.',
            },
          ].map((item) => {
            const checked = will.executionChecklist[item.key];
            return (
              <button
                key={item.key}
                id={`chk-${item.key}`}
                type="button"
                onClick={() => toggleChecklist(item.key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  checked
                    ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {item.step}
                    </span>
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold leading-snug">{item.title}</div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Surrogate&apos;s Court Staple Rule:</strong> Once the Will and <code className="font-mono">SCPA § 1406</code> Self-Proving Affidavit are stapled and executed, <strong>never remove the staples</strong> to photocopy or scan. Staple holes create a presumption of page substitution in NY Surrogate&apos;s Court requiring a formal Staple Affidavit.
          </span>
        </div>
      </div>
    </div>
  );
};
