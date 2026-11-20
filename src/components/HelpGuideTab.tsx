import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ArrowRight,
  Landmark,
  Scale,
  FileText,
  Briefcase,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HelpGuideTabProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

interface GlossaryEntry {
  term: string;
  statute?: string;
  category: 'Accounts & Probate' | 'Spousal Rights' | 'Will & Signing' | 'Powers & Medical';
  plainMeaning: string;
  whyItMatters: string;
}

const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: 'Probate vs. Non-Probate Assets',
    category: 'Accounts & Probate',
    plainMeaning:
      'Probate assets are accounts or property in your sole name with NO named beneficiary (they require a court process to transfer). Non-probate assets have a named beneficiary (like an IRA, TOD, or POD) and transfer directly to your children within days of death upon presenting a death certificate.',
    whyItMatters:
      'In a blended marriage, keeping formal probate assets under $50,000 avoids mandatory Surrogate’s Court citations to your surviving spouse.',
  },
  {
    term: 'TOD (Transfer on Death)',
    statute: 'NY EPTL Article 13-4',
    category: 'Accounts & Probate',
    plainMeaning:
      'A free beneficiary registration you add to a taxable stock/brokerage account (at Fidelity, Vanguard, Schwab, etc.). While you are alive, you control 100% of the account; when you pass away, ownership transfers automatically to your named children without probate.',
    whyItMatters:
      'Without a TOD designation, a sole-name brokerage account becomes a probate asset controlled by Surrogate’s Court.',
  },
  {
    term: 'POD (Payable on Death) / "Totten Trust"',
    statute: 'NY EPTL Article 7-5',
    category: 'Accounts & Probate',
    plainMeaning:
      'New York’s legal term for a beneficiary designation on a bank checking, savings, or CD account (often titled "In Trust For [Child Name]"). It costs $0 at your bank and passes the money directly to your children outside of probate.',
    whyItMatters:
      'Converts bank accounts from probate assets into direct-transfer assets while letting you keep sole control during your lifetime.',
  },
  {
    term: 'Per Stirpes vs. Per Capita',
    statute: 'NY EPTL § 1-2.14',
    category: 'Accounts & Probate',
    plainMeaning:
      '"Per Stirpes" (Latin for "by the roots/branches") means if one of your children passes away before you, their share automatically goes to their own children (your grandchildren). "Per Capita" means a deceased child’s share shifts 100% to your surviving child, disinheriting your deceased child’s kids.',
    whyItMatters:
      'Most parents want Per Stirpes checked on every IRA, TOD, POD, and Will so grandchildren are never accidentally disinherited.',
  },
  {
    term: 'NY $50,000 Small Estate Limit (Voluntary Administration)',
    statute: 'NY SCPA § 1301',
    category: 'Accounts & Probate',
    plainMeaning:
      'If your sole-name assets that lack a beneficiary (plus personal property) total $50,000 or less, New York allows your child to file a simple $1 Small Estate Affidavit ("Voluntary Administration") instead of hiring a probate lawyer for full Surrogate’s Court probate.',
    whyItMatters:
      'Staying at or below $50,000 in non-POD probate assets gives your Executor cash to pay funeral/tax bills while avoiding formal probate court.',
  },
  {
    term: 'Spousal Right of Election (Elective Share)',
    statute: 'NY EPTL § 5-1.1-A',
    category: 'Spousal Rights',
    plainMeaning:
      'New York law gives a surviving spouse the automatic legal right to claim the greater of $50,000 or 1/3 (33.33%) of your entire "Net Elective Estate"—even if you kept 100% of your accounts in your sole name and left your spouse $0 in your Will.',
    whyItMatters:
      'You CANNOT defeat New York’s 1/3 spousal claim merely by putting your children on your IRAs, TODs, and PODs. Only a notarized deed-form written waiver stops it.',
  },
  {
    term: 'Testamentary Substitutes',
    statute: 'NY EPTL § 5-1.1-A(b)(1)',
    category: 'Spousal Rights',
    plainMeaning:
      'Assets that bypass probate—including Traditional IRAs, Roth IRAs, 401(k)s, TOD brokerage accounts, and POD bank accounts—that New York law sweeps back into the calculation of your spouse’s 1/3 Elective Share.',
    whyItMatters:
      'Without a spousal waiver, your children can be legally forced to hand over 1/3 of their inherited IRAs and TOD/POD accounts pro-rata.',
  },
  {
    term: 'Deed-Acknowledged Mutual Spousal Waiver',
    statute: 'NY EPTL § 5-1.1-A(e) & DRL § 236(B)(3)',
    category: 'Spousal Rights',
    plainMeaning:
      'A formal written agreement where both spouses waive their 1/3 elective share rights against each other’s separate estates. Under NY law, it must be signed before a Notary Public using the exact certificate wording used to record a New York real estate deed.',
    whyItMatters:
      'This is the ONLY way under New York law to guarantee 100% of your IRAs, TOD/POD accounts, and estate pass to your children free of spousal or Medicaid claims.',
  },
  {
    term: 'ERISA Spousal Consent Rule (401(k) vs. IRA)',
    statute: '29 U.S.C. § 1055 (Federal ERISA)',
    category: 'Spousal Rights',
    plainMeaning:
      'Federal law governing employer 401(k) and pension plans automatically makes your current spouse your 100% beneficiary unless your spouse signs a notarized plan waiver. Individual IRAs (Traditional and Roth) are NOT subject to this federal rule.',
    whyItMatters:
      'If you have an old workplace 401(k), rolling it over into a Rollover IRA in your sole name lets you name your children as primary beneficiaries immediately.',
  },
  {
    term: 'Disinterested Witnesses',
    statute: 'NY EPTL § 3-3.2',
    category: 'Will & Signing',
    plainMeaning:
      'Two adult witnesses to your Will who do NOT inherit anything under the Will (i.e., neighbors, coworkers, or friends—NEVER your children or spouse).',
    whyItMatters:
      'If a child acts as one of the two necessary witnesses to your Will, New York law voids their inheritance under the Will!',
  },
  {
    term: 'Self-Proving Witness Affidavit',
    statute: 'NY SCPA § 1406',
    category: 'Will & Signing',
    plainMeaning:
      'A sworn statement signed by your two witnesses in front of a Notary Public at the same time you sign your Will, confirming you were of sound mind and followed all NY signing rules.',
    whyItMatters:
      'Without this notarized affidavit, your children would have to track down both witnesses years later to sign court forms or testify after you pass away.',
  },
  {
    term: 'Surrogate’s Court Staple Rule',
    statute: 'NY Surrogate’s Court Uniform Rule § 207.19',
    category: 'Will & Signing',
    plainMeaning:
      'Once your printed Will and Self-Proving Affidavit are stapled together and signed, the staple must NEVER be removed—not even to feed pages into a scanner.',
    whyItMatters:
      'Extra staple holes trigger an investigation by the Surrogate’s Court clerk into whether pages were secretly swapped after signing.',
  },
  {
    term: 'NY Statutory Short Form Power of Attorney (POA)',
    statute: 'NY GOL § 5-1513',
    category: 'Powers & Medical',
    plainMeaning:
      'Legal document appointing trusted person(s) (such as your adult children) to handle your banking, taxes, and financial affairs if you become incapacitated during your lifetime.',
    whyItMatters:
      'Since June 2021, NY requires your POA to be signed before TWO disinterested witnesses PLUS a Notary Public.',
  },
  {
    term: 'NY Health Care Proxy',
    statute: 'NY Public Health Law § 2981',
    category: 'Powers & Medical',
    plainMeaning:
      'Legal document naming a Primary and Backup Health Care Agent to make medical decisions for you if you are unable to speak for yourself.',
    whyItMatters:
      'Allows you to appoint an adult child if you prefer, and must be signed in front of two adult witnesses (who are not the named agents).',
  },
  {
    term: 'Living Will (Advance Directive)',
    statute: 'NY Common Law ("Clear & Convincing Evidence")',
    category: 'Powers & Medical',
    plainMeaning:
      'A written statement of your exact end-of-life care wishes—such as comfort care, ventilators, and artificial nutrition/hydration—if you are terminally ill or permanently unconscious.',
    whyItMatters:
      'New York enforces a strict legal standard before withdrawing life support. A Living Will backs up your Health Care Agent with written proof of your wishes.',
  },
  {
    term: 'Stand-Alone HIPAA Authorization',
    statute: '45 CFR § 164.508',
    category: 'Powers & Medical',
    plainMeaning:
      'A medical privacy release that lets your chosen children speak with doctors, view test results, and handle hospital billing right now—even while you are fully conscious.',
    whyItMatters:
      'A Health Care Proxy only activates after a doctor declares you incapacitated. HIPAA fills the gap during routine hospitalizations or medical appointments.',
  },
  {
    term: 'Disposition of Remains Agent',
    statute: 'NY Public Health Law § 4201',
    category: 'Powers & Medical',
    plainMeaning:
      'A short NY statutory form appointing the exact person you want in charge of your funeral, burial, or cremation.',
    whyItMatters:
      'Critical for blended families: without this form, New York gives your surviving spouse automatic control over your remains—even if you waived spousal inheritance rights.',
  },
  {
    term: 'NY Medicaid Spousal Refusal & MAPT',
    statute: 'NY Social Services Law § 366(3)(a)',
    category: 'Spousal Rights',
    plainMeaning:
      'Age 62+ elder-law strategies: a Medicaid Asset Protection Trust (MAPT) starts NY’s 5-year nursing home lookback clock, while NY Spousal Refusal lets a healthy spouse refuse to contribute their separate assets toward the other spouse’s care.',
    whyItMatters:
      'Protects your children’s inheritance from long-term care costs and keeps each spouse’s separate assets insulated.',
  },
  {
    term: 'NY Transfer on Death (TOD) Deed',
    statute: 'NY Real Property Law § 424',
    category: 'Accounts & Probate',
    plainMeaning:
      'A revocable deed signed before 2 witnesses and a notary and recorded with the county clerk that transfers NY real estate directly to named beneficiaries upon death.',
    whyItMatters:
      'Allows a sole-name NY home or condo to bypass Surrogate’s Court probate—similar to TOD on a brokerage account.',
  },
  {
    term: 'Digital Assets Authorization (RUFADAA)',
    statute: 'NY EPTL Article 13-A',
    category: 'Will & Signing',
    plainMeaning:
      'Explicit legal permission in your Will and POA allowing your Executor or Agent to access online banking, email, cloud photos, and digital accounts.',
    whyItMatters:
      'Tech companies like Apple and Google lock accounts upon death unless you grant RUFADAA authority and set up Apple Legacy Contact / Google Inactive Account Manager.',
  },
  {
    term: 'Family Exempt Property (Off-the-Top Spousal Set-Aside)',
    statute: 'NY EPTL § 5-3.1',
    category: 'Spousal Rights',
    plainMeaning:
      'Completely independent of the 1/3 Right of Election, NY law automatically awards a surviving spouse up to $25,000 in cash/equivalents, 1 motor vehicle up to $25,000, and $20,000 in household furniture/appliances.',
    whyItMatters:
      'General waiver language often fails in Surrogate’s Court—your Mutual Waiver must explicitly waive “Exempt Property under EPTL § 5-3.1” or your spouse can claim these items even if disinherited.',
  },
  {
    term: 'Probate Citation & SCPA § 1404 Witness Examination',
    statute: 'NY SCPA § 1403 & § 1404',
    category: 'Will & Signing',
    plainMeaning:
      'When a Will is filed for probate, your surviving spouse must be officially notified (cited) even if disinherited, and may demand formal questioning of the Will’s witnesses under SCPA § 1404.',
    whyItMatters:
      'A DIY Will lacks an attorney’s “presumption of regularity.” Using a fully funded Revocable Living Trust (or attorney-supervised Will signing) avoids or minimizes these delays.',
  },
];

export const HelpGuideTab: React.FC<HelpGuideTabProps> = ({ onNavigateTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Accounts & Probate', 'Spousal Rights', 'Will & Signing', 'Powers & Medical'];

  const filteredGlossary = GLOSSARY_ENTRIES.filter((entry) => {
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      entry.term.toLowerCase().includes(q) ||
      (entry.statute && entry.statute.toLowerCase().includes(q)) ||
      entry.plainMeaning.toLowerCase().includes(q) ||
      entry.whyItMatters.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const masterSteps = [
    {
      num: 'Step 1',
      tab: 'assets' as ActiveTab,
      title: 'Inventory Every Sole-Name Account & Add TOD/POD Beneficiaries (Tab 1)',
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      bullets: [
        'Enter each of your IRAs, 401(k)s, brokerage accounts, bank accounts, and personal property in Tab 1.',
        'Contact your brokerage firm(s) to add a TOD (Transfer on Death) form and your bank(s) to add a POD (Payable on Death / Totten Trust) form naming your children totaling 100%.',
        'Make sure the "Per Stirpes" box is checked on every beneficiary form so a predeceased child’s share passes to their children (your grandchildren).',
        'Leave one small sole-name checking account ($15,000–$35,000, strictly under $50,000 total probate assets) WITHOUT a POD so your Executor has cash to pay funeral and final tax bills via a $1 NY Small Estate Affidavit (SCPA § 1301).',
      ],
      btnLabel: 'Go to Tab 1: Asset Tracker',
    },
    {
      num: 'Step 2',
      tab: 'elective-share' as ActiveTab,
      title: 'Check Your Spousal Right of Election Exposure (Tab 2)',
      icon: <Scale className="w-5 h-5 text-amber-400" />,
      bullets: [
        'Review Tab 2 to see how New York EPTL § 5-1.1-A counts your IRAs, TOD brokerage accounts, and POD bank accounts as "Testamentary Substitutes."',
        'Compare Scenario A (Without Written Waiver — where 1/3 of your children’s inherited accounts can be clawed back by a spouse, their POA/guardian, or Medicaid) vs. Scenario B (With a Deed-Acknowledged Mutual Waiver — $0 spousal claim, 100% to your children).',
      ],
      btnLabel: 'Go to Tab 2: Elective Share Simulator',
    },
    {
      num: 'Step 3',
      tab: 'will-generator' as ActiveTab,
      title: 'Generate & Properly Execute Your NY Backup Will (Tab 3)',
      icon: <FileText className="w-5 h-5 text-sky-400" />,
      bullets: [
        'Enter your full legal name, NY county, spouse’s full name (for the intentional-omission clause), children’s full names, and Primary/Successor Executors.',
        'Print the generated Will and SCPA § 1406 Self-Proving Affidavit on standard US Letter paper.',
        'Follow all 5 Execution Guardrails: sign at the physical end in front of two disinterested adult witnesses (not your children or spouse) and a NY Notary Public, have witnesses write their residential addresses, and never unstaple the signed original.',
      ],
      btnLabel: 'Go to Tab 3: Backup Will Generator',
    },
    {
      num: 'Step 4',
      tab: 'attorney-prep' as ActiveTab,
      title: 'Print Your 1-Page NY Attorney Briefing Packet for the Mutual Waiver (Tab 4)',
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
      bullets: [
        'Add an approximate list of your spouse’s separate accounts in Tab 4 so both Schedules A & B financial disclosures are ready.',
        'Choose your Primary and Backup Agents for your NY Statutory Short Form Power of Attorney (GOL § 5-1513) and NY Health Care Proxy.',
        'Click "Print Attorney Briefing Packet" and bring the 1-page sheet to a local New York estate planning attorney to draft and notarize the EPTL § 5-1.1-A(e) Mutual Waiver in real-estate deed form.',
      ],
      btnLabel: 'Go to Tab 4: Attorney Prep Packet',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-semibold">
              Plain-English User Guide &amp; New York Legal Glossary
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              How This Planner Works &amp; Exact Steps to Protect 100% of Your Estate for Your Children
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              New York estate law has unique rules for blended families. Even if every dollar you own is in your <strong>sole name</strong> and you name your children as 100% beneficiaries on every account, two New York traps can still intercept your children&apos;s inheritance: (1) <strong>Surrogate&apos;s Court Probate</strong> if sole-name accounts without beneficiaries exceed $50,000, and (2) <strong>New York&apos;s 1/3 Spousal Right of Election (<code className="text-amber-300">EPTL § 5-1.1-A</code>)</strong>. Follow the 4-Step Master Plan below to solve both.
            </p>
          </div>
        </div>
      </div>

      {/* Master 4-Step Walkthrough */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Step-by-Step Roadmap: What to Do in Each Section
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete these four sections in order. All progress saves automatically inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {masterSteps.map((st) => (
            <div
              key={st.num}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#0F172A] text-white shrink-0">
                    {st.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                      {st.num}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {st.title}
                    </h4>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  {st.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(st.tab)}
                className="w-full py-2 px-3 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {st.btnLabel} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plain-English Glossary of New York Estate Terms */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-slate-800" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Plain-English Glossary: What Every Term &amp; NY Statute Means
              </h3>
              <p className="text-xs text-slate-500">
                Search or filter by category to understand every legal term and alert in the app.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-glossary-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search term (e.g., TOD, Per Stirpes, 5-1.1-A)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item) => (
            <div
              key={item.term}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900">{item.term}</h4>
                {item.statute && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-200 text-slate-800">
                    {item.statute}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">What it means: </strong>
                {item.plainMeaning}
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                <strong className="text-emerald-900">Why it matters to you: </strong>
                {item.whyItMatters}
              </div>
            </div>
          ))}

          {filteredGlossary.length === 0 && (
            <div className="col-span-2 p-8 text-center text-xs text-slate-500">
              No glossary terms matched &ldquo;{searchQuery}&rdquo;. Try clearing the search box.
            </div>
          )}
        </div>
      </div>

      {/* Common Mistakes to Avoid Box */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <h3 className="text-sm font-bold">
            Top 3 Mistakes Married New Yorkers Make in Blended Families
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-950">
          <div className="p-3 rounded-lg bg-white border border-amber-200">
            <div className="font-bold text-slate-900 mb-1">
              Mistake #1: Relying on a Verbal Promise
            </div>
            <p className="text-slate-700 leading-relaxed">
              Even if your spouse never intends to touch your children&apos;s money, if your spouse later enters a nursing home on Medicaid, the county can force an <code className="font-mono">EPTL § 5-1.1-A</code> claim unless a notarized deed-form waiver was signed.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-amber-200">
            <div className="font-bold text-slate-900 mb-1">
              Mistake #2: Having a Child Witness Your Will
            </div>
            <p className="text-slate-700 leading-relaxed">
              Under <code className="font-mono">EPTL § 3-3.2</code>, if a child who inherits under your Will serves as one of the two witnesses, their inheritance under the Will is legally voided. Always use two unrelated adult witnesses.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-amber-200">
            <div className="font-bold text-slate-900 mb-1">
              Mistake #3: Leaving Over $50,000 Without TOD/POD
            </div>
            <p className="text-slate-700 leading-relaxed">
              If sole-name accounts without a TOD/POD beneficiary exceed $50,000, your children cannot use the $1 Small Estate Affidavit (<code className="font-mono">SCPA § 1301</code>) and must serve formal Surrogate&apos;s Court citations on your surviving spouse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
