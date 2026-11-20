import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Info,
  ShieldAlert,
  DollarSign,
  Users,
  HelpCircle,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';
import {
  AccountType,
  AssetAccount,
  BeneficiarySplit,
  ChildRecord,
  OwnershipTitle,
  TransferMechanism,
  ActiveTab,
} from '../types';
import { SectionHelpBanner } from './SectionHelpBanner';

interface AssetTrackerTabProps {
  accounts: AssetAccount[];
  childrenList: ChildRecord[];
  onUpdateAccounts: (accounts: AssetAccount[]) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

const ACCOUNT_TYPES: AccountType[] = [
  'Traditional IRA',
  'Roth IRA',
  'Taxable Brokerage',
  'Checking Account',
  'Savings / CD',
  'Workplace 401(k)/Pension',
  'Personal Property',
];

const TRANSFER_MECHANISMS: TransferMechanism[] = [
  'Named IRA/Plan Beneficiary',
  'TOD (Transfer on Death)',
  'POD (Payable on Death / Totten Trust)',
  'None (Probate Asset)',
];

const OWNERSHIP_TITLES: OwnershipTitle[] = [
  'Sole Name',
  'Joint with Right of Survivorship',
  'Tenants in Common',
];

export const AssetTrackerTab: React.FC<AssetTrackerTabProps> = ({
  accounts,
  childrenList,
  onUpdateAccounts,
  onNavigateTab,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPerStirpesTooltip, setShowPerStirpesTooltip] = useState(false);

  // Form State
  const [nickname, setNickname] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('Taxable Brokerage');
  const [balance, setBalance] = useState<string>('');
  const [ownershipTitle, setOwnershipTitle] = useState<OwnershipTitle>('Sole Name');
  const [transferMechanism, setTransferMechanism] = useState<TransferMechanism>('TOD (Transfer on Death)');
  const [perStirpes, setPerStirpes] = useState<boolean>(true);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiarySplit[]>(() => {
    const validChildren = childrenList.filter((c) => c && c.fullName && c.fullName.trim());
    if (validChildren.length > 0) {
      const equalShare = Math.floor((100 / validChildren.length) * 100) / 100;
      return validChildren.map((c, idx) => ({
        id: `ben-${idx}`,
        name: c.fullName.trim(),
        percentage:
          idx === validChildren.length - 1
            ? Number((100 - equalShare * (validChildren.length - 1)).toFixed(2))
            : equalShare,
      }));
    }
    return [
      { id: 'ben-1', name: '', percentage: 100 },
    ];
  });
  const [formError, setFormError] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  // Recommended mechanism helper when user changes accountType
  const handleAccountTypeChange = (newType: AccountType) => {
    setAccountType(newType);
    if (newType === 'Traditional IRA' || newType === 'Roth IRA' || newType === 'Workplace 401(k)/Pension') {
      setTransferMechanism('Named IRA/Plan Beneficiary');
    } else if (newType === 'Taxable Brokerage') {
      setTransferMechanism('TOD (Transfer on Death)');
    } else if (newType === 'Checking Account' || newType === 'Savings / CD') {
      setTransferMechanism('POD (Payable on Death / Totten Trust)');
    } else if (newType === 'Personal Property') {
      setTransferMechanism('None (Probate Asset)');
    }
  };

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (Number(b.percentage) || 0), 0);
  const isSplitValid = Math.abs(totalPercentage - 100) < 0.01 && beneficiaries.every((b) => b.name.trim().length > 0);

  const resetForm = () => {
    setEditingId(null);
    setNickname('');
    setAccountType('Taxable Brokerage');
    setBalance('');
    setOwnershipTitle('Sole Name');
    setTransferMechanism('TOD (Transfer on Death)');
    setPerStirpes(true);
    setFormError(null);
    const validChildren = childrenList.filter((c) => c && c.fullName && c.fullName.trim());
    if (validChildren.length > 0) {
      const equalShare = Math.floor((100 / validChildren.length) * 100) / 100;
      setBeneficiaries(
        validChildren.map((c, idx) => ({
          id: `ben-${Date.now()}-${idx}`,
          name: c.fullName.trim(),
          percentage:
            idx === validChildren.length - 1
              ? Number((100 - equalShare * (validChildren.length - 1)).toFixed(2))
              : equalShare,
        }))
      );
    } else {
      setBeneficiaries([{ id: 'ben-1', name: '', percentage: 100 }]);
    }
  };

  const startEdit = (acc: AssetAccount) => {
    setEditingId(acc.id);
    setNickname(acc.nickname);
    setAccountType(acc.accountType);
    setBalance(String(acc.balance));
    setOwnershipTitle(acc.ownershipTitle);
    setTransferMechanism(acc.transferMechanism);
    setPerStirpes(acc.perStirpes);
    setBeneficiaries(acc.beneficiaries.map((b) => ({ ...b })));
    setFormError(null);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setFormError('Please enter an Account Nickname / Institution.');
      return;
    }
    const numericBalance = Number(balance);
    if (isNaN(numericBalance) || numericBalance < 0) {
      setFormError('Please enter a valid non-negative dollar balance.');
      return;
    }
    if (!isSplitValid) {
      setFormError('Primary beneficiary splits must total exactly 100% and every row must have a beneficiary name.');
      return;
    }

    const updatedAccount: AssetAccount = {
      id: editingId || `acc-${Date.now()}`,
      nickname: nickname.trim(),
      accountType,
      balance: numericBalance,
      ownershipTitle,
      transferMechanism,
      beneficiaries,
      perStirpes,
    };

    if (editingId) {
      onUpdateAccounts(accounts.map((a) => (a.id === editingId ? updatedAccount : a)));
    } else {
      onUpdateAccounts([...accounts, updatedAccount]);
    }
    resetForm();
  };

  const handleDeleteAccount = (id: string) => {
    onUpdateAccounts(accounts.filter((a) => a.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const handleQuickFixMechanism = (id: string, targetMechanism: TransferMechanism) => {
    onUpdateAccounts(
      accounts.map((a) => (a.id === id ? { ...a, transferMechanism: targetMechanism } : a))
    );
  };

  const splitEquallyAmongChildren = () => {
    const names =
      childrenList.length > 0
        ? childrenList.map((c) => c.fullName)
        : ['Child 1', 'Child 2'];
    const equalShare = Math.floor((100 / names.length) * 100) / 100;
    setBeneficiaries(
      names.map((name, idx) => ({
        id: `ben-${Date.now()}-${idx}`,
        name,
        percentage:
          idx === names.length - 1
            ? Number((100 - equalShare * (names.length - 1)).toFixed(2))
            : equalShare,
      }))
    );
  };

  // --- NY Statutory Compliance Calculations ---
  const totalEstateValue = accounts.reduce((sum, a) => sum + a.balance, 0);

  // 1. Unprotected Account Alert: Flag any Taxable Brokerage without TOD and any Checking/Savings without POD
  const unprotectedBrokerageAccounts = accounts.filter(
    (a) => a.accountType === 'Taxable Brokerage' && a.transferMechanism !== 'TOD (Transfer on Death)'
  );
  const unprotectedBankAccounts = accounts.filter(
    (a) =>
      (a.accountType === 'Checking Account' || a.accountType === 'Savings / CD') &&
      a.transferMechanism !== 'POD (Payable on Death / Totten Trust)'
  );
  const allUnprotectedAccounts = [...unprotectedBrokerageAccounts, ...unprotectedBankAccounts];

  // 2. NY $50,000 Small Estate Threshold Gauge (SCPA § 1301): Sum all Sole Name assets that have None (Probate Asset)
  const soleNameProbateAccounts = accounts.filter(
    (a) => a.ownershipTitle === 'Sole Name' && a.transferMechanism === 'None (Probate Asset)'
  );
  const totalSoleProbateAssets = soleNameProbateAccounts.reduce((sum, a) => sum + a.balance, 0);
  const SMALL_ESTATE_LIMIT = 50000;
  const qualifiesSmallEstate = totalSoleProbateAssets <= SMALL_ESTATE_LIMIT;
  const gaugePercentage = Math.min(100, Math.round((totalSoleProbateAssets / SMALL_ESTATE_LIMIT) * 100));

  // 3. Final Expense Liquidity Alert: Check if total None (Probate Asset) cash is $0
  const probateCashAccounts = accounts.filter(
    (a) =>
      a.transferMechanism === 'None (Probate Asset)' &&
      (a.accountType === 'Checking Account' || a.accountType === 'Savings / CD')
  );
  const totalProbateCash = probateCashAccounts.reduce((sum, a) => sum + a.balance, 0);

  // 4. ERISA Spousal Consent Warning: Check if any account is Workplace 401(k)/Pension or currently selected in form
  const erisaAccounts = accounts.filter((a) => a.accountType === 'Workplace 401(k)/Pension');
  const showErisaWarning = erisaAccounts.length > 0 || accountType === 'Workplace 401(k)/Pension';

  return (
    <div className="space-y-6">
      <SectionHelpBanner
        sectionTitle="Section 1 Guide: Organizing Your Accounts to Bypass NY Probate Court"
        plainEnglishSummary="Any account in your sole name that has a named beneficiary (like an IRA, a TOD brokerage account, or a POD bank account) transfers directly to your children within days of death—completely bypassing New York Surrogate’s Court probate. Your goal here is to make sure your major accounts have TOD/POD beneficiaries while keeping your 'None (Probate Asset)' accounts at or below $50,000 so your children can use New York's $1 Small Estate Affidavit."
        steps={[
          {
            stepNumber: 1,
            title: 'Enter Each of Your Sole-Name Accounts',
            detail:
              'Use the form on the left to list all of your IRAs, 401(k)s, taxable brokerage accounts, bank checking/savings accounts, and personal property.',
          },
          {
            stepNumber: 2,
            title: 'Set Direct Beneficiary Mechanisms (IRA, TOD, POD)',
            detail:
              'Make sure every Taxable Brokerage account is set to "TOD (Transfer on Death)" and every main Savings/CD account is set to "POD (Payable on Death / Totten Trust)". Contact your bank/brokerage to file these free forms.',
          },
          {
            stepNumber: 3,
            title: 'Turn On "Per Stirpes" & Split 100% Among Your Children',
            detail:
              'Select "Yes (Recommended)" for Per Stirpes and verify your children’s percentages total 100%.',
          },
          {
            stepNumber: 4,
            title: 'Keep One Small Checking Buffer (<$50,000 Total Probate Assets)',
            detail:
              'Leave one small checking account ($15k–$35k) as "None (Probate Asset)" to pay funeral and final tax bills, while keeping the NY $50,000 Small Estate Gauge in the green.',
          },
        ]}
        keyTerms={[
          {
            term: 'TOD (Transfer on Death)',
            definition:
              'A free beneficiary registration for taxable stock/brokerage accounts. Passes the account directly to your children outside of probate.',
          },
          {
            term: 'POD (Payable on Death / Totten Trust)',
            definition:
              'A free bank beneficiary designation ("In Trust For") on checking, savings, and CD accounts.',
          },
          {
            term: 'Per Stirpes (EPTL § 1-2.14)',
            definition:
              'If a child predeceases you, their share goes to their own children (your grandchildren) instead of shifting 100% to a surviving sibling.',
          },
          {
            term: 'SCPA § 1301 ($50,000 Small Estate Limit)',
            definition:
              'If sole-name accounts without beneficiaries total $50,000 or less, your Executor can use a $1 Small Estate Affidavit instead of formal Surrogate’s Court probate.',
          },
        ]}
        onOpenFullHelp={() => onNavigateTab('help-guide')}
      />

      {/* Top Executive Metrics & NY $50,000 Small Estate Threshold Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* NY SCPA § 1301 Small Estate Gauge Card */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-900 text-white">
                  SCPA § 1301
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  NY $50,000 Small Estate Threshold Gauge
                </h2>
              </div>
              <span className="text-sm font-mono font-bold text-slate-900">
                {formatCurrency(totalSoleProbateAssets)} / {formatCurrency(SMALL_ESTATE_LIMIT)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  qualifiesSmallEstate ? 'bg-emerald-600' : 'bg-red-600'
                }`}
                style={{ width: `${gaugePercentage}%` }}
              />
            </div>

            {/* Required Status Badge */}
            {qualifiesSmallEstate ? (
              <div
                id="badge-small-estate-compliant"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">
                    Qualifies for NY Voluntary Administration — $1 Small Estate Affidavit, avoids formal probate
                  </span>
                  <p className="text-emerald-800 mt-0.5 text-xs">
                    Sole-name probate assets ({formatCurrency(totalSoleProbateAssets)}) are within the $50,000 statutory cap under New York SCPA Article 13.
                  </p>
                </div>
              </div>
            ) : (
              <div
                id="badge-small-estate-exceeded"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-900"
              >
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">
                    Exceeds NY $50,000 Small Estate Limit — Triggers formal Surrogate&apos;s Court probate and mandatory court citation notices to surviving spouse
                  </span>
                  <p className="text-red-800 mt-0.5 text-xs">
                    Under <code className="font-mono">SCPA § 1403(1)(a)</code>, formal probate requires serving a formal court citation on your surviving spouse, giving them an immediate forum to contest the Will or file a Right of Election. Add TOD/POD designations to reduce probate assets below $50,000.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Summary Card */}
        <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-xl border border-slate-800 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Total Sole-Name Estate Portfolio
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 font-mono text-white">
              {formatCurrency(totalEstateValue)}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Direct Non-Probate (IRA/TOD/POD)</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                  {formatCurrency(totalEstateValue - totalSoleProbateAssets)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Probate Assets (Sole Name)</div>
                <div
                  className={`text-base font-bold font-mono mt-0.5 ${
                    qualifiesSmallEstate ? 'text-amber-300' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(totalSoleProbateAssets)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>
              Note: TOD/POD &amp; IRAs bypass probate but remain subject to <code className="text-amber-300">EPTL § 5-1.1-A</code>.
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('elective-share')}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 ml-2 cursor-pointer"
            >
              Simulate Claim <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Automated NY Compliance Alerts */}
      <div className="space-y-3" aria-label="New York Statutory Compliance Alerts">
        {/* Alert 1: Unprotected Account Alert */}
        {allUnprotectedAccounts.length > 0 && (
          <div
            id="alert-unprotected-accounts"
            className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-amber-950">
                    Unprotected Account Alert ({allUnprotectedAccounts.length} Account
                    {allUnprotectedAccounts.length > 1 ? 's' : ''} Missing Direct Beneficiary Designation)
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-200/80 text-amber-900">
                    NY EPTL Art. 13-4 (TOD) / Art. 7-5 (POD Totten Trust)
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-1">
                  New York allows Taxable Brokerage accounts to pass directly to children via a{' '}
                  <strong>TOD (Transfer on Death)</strong> registration and Checking/Savings accounts via a{' '}
                  <strong>POD (Payable on Death / Totten Trust)</strong> designation. Notice: Any checking account deliberately left without POD as a small estate buffer (&lt;$50k) is flagged here so you can verify it is intentional.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {allUnprotectedAccounts.map((acc) => {
                    const recommended: TransferMechanism =
                      acc.accountType === 'Taxable Brokerage'
                        ? 'TOD (Transfer on Death)'
                        : 'POD (Payable on Death / Totten Trust)';
                    return (
                      <div
                        key={acc.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs"
                      >
                        <span className="font-semibold text-slate-900">{acc.nickname}</span>
                        <span className="text-slate-500 font-mono">({formatCurrency(acc.balance)})</span>
                        <button
                          type="button"
                          onClick={() => handleQuickFixMechanism(acc.id, recommended)}
                          className="ml-1 px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors cursor-pointer"
                        >
                          Switch to {acc.accountType === 'Taxable Brokerage' ? 'TOD' : 'POD'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert 3: Final Expense Liquidity Alert */}
        {totalProbateCash === 0 && (
          <div
            id="alert-final-expense-liquidity"
            className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-950">
                  Final Expense Liquidity Alert ($0 Non-POD Estate Cash Buffer)
                </h3>
                <p className="text-xs text-amber-900 mt-1">
                  Because <strong>100% of your cash accounts</strong> currently transfer directly to beneficiaries via POD/TOD upon death, there will be{' '}
                  <strong>$0 in your probate estate</strong> to pay funeral bills, final medical co-pays, or final NY/federal income tax bills. Either your children must pay these expenses voluntarily out of their inherited funds, or you should maintain a small non-POD checking buffer (e.g., $15,000–$35,000, keeping total probate assets under the $50,000 <code className="font-mono">SCPA § 1301</code> Small Estate limit).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alert 4: ERISA Spousal Consent Warning */}
        {showErisaWarning && (
          <div
            id="alert-erisa-spousal-consent"
            className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-950 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-red-950">
                    Federal ERISA Spousal Consent Warning (Workplace 401(k) / Qualified Pension)
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-200/80 text-red-900 font-mono">
                    29 U.S.C. § 1055 (REA / ERISA)
                  </span>
                </div>
                <p className="text-xs text-red-900 mt-1">
                  Unlike <strong>Traditional IRAs</strong> and <strong>Roth IRAs</strong> (which are governed by state law and allow you to name your children 100% without spousal consent), a <strong>Workplace 401(k) or Pension</strong> is governed by federal ERISA rules that automatically make your current spouse the 100% beneficiary unless your spouse signs a <strong>notarized plan-specific spousal waiver</strong>.{' '}
                  <span className="font-semibold">
                    Tip: If you are retired or over age 59½, rolling a 401(k) into a Sole-Name Rollover Traditional IRA removes federal ERISA automatic spousal preemption (though NY&apos;s 1/3 elective share under EPTL § 5-1.1-A still applies unless waived).
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Split Grid: Add/Edit Account Form (Left) + Portfolio Accounts Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Add / Edit Account Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  Edit Account Details
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Add Sole-Name Account or Asset
                </>
              )}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-4">
            {/* Account Nickname */}
            <div>
              <label
                htmlFor="input-account-nickname"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Account Nickname / Institution
              </label>
              <input
                id="input-account-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Fidelity Traditional IRA, Vanguard Taxable Brokerage, Chase Checking"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Account Type & Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="select-account-type"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Account Type
                </label>
                <select
                  id="select-account-type"
                  value={accountType}
                  onChange={(e) => handleAccountTypeChange(e.target.value as AccountType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="input-account-balance"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Approximate Balance ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    id="input-account-balance"
                    type="number"
                    min="0"
                    step="100"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Ownership Title & Transfer Mechanism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="select-ownership-title"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Ownership Title
                </label>
                <select
                  id="select-ownership-title"
                  value={ownershipTitle}
                  onChange={(e) => setOwnershipTitle(e.target.value as OwnershipTitle)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {OWNERSHIP_TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-transfer-mechanism"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Transfer Mechanism
                </label>
                <select
                  id="select-transfer-mechanism"
                  value={transferMechanism}
                  onChange={(e) => setTransferMechanism(e.target.value as TransferMechanism)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {TRANSFER_MECHANISMS.map((mech) => (
                    <option key={mech} value={mech}>
                      {mech}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Per Stirpes Designation Toggle with Tooltip */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    <span className="italic">Per Stirpes</span> Designation
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPerStirpesTooltip(!showPerStirpesTooltip)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="What does Per Stirpes mean under New York law?"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setPerStirpes(true)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      perStirpes
                        ? 'bg-[#0F172A] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Yes (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPerStirpes(false)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      !perStirpes
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    No (Per Capita)
                  </button>
                </div>
              </div>

              {showPerStirpesTooltip && (
                <div className="mt-2 p-2.5 rounded bg-slate-900 text-slate-100 text-xs leading-relaxed">
                  <strong>NY EPTL § 1-2.14 (<span className="italic">Per Stirpes</span>):</strong> Ensures that if one of your children predeceases you, that child&apos;s share passes down to their own children (your grandchildren) rather than shifting 100% to a surviving sibling. Always check the <em>&ldquo;Per Stirpes&rdquo;</em> box on Fidelity, Vanguard, Schwab, and bank beneficiary forms.
                </div>
              )}
            </div>

            {/* Primary Beneficiaries & Percentage Split */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Primary Beneficiaries &amp; Percentage Split
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={splitEquallyAmongChildren}
                    className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                  >
                    Equal Split (Children)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBeneficiaries([
                        ...beneficiaries,
                        { id: `ben-${Date.now()}`, name: '', percentage: 0 },
                      ])
                    }
                    className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {beneficiaries.map((ben, idx) => (
                  <div key={ben.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ben.name}
                      onChange={(e) => {
                        const next = [...beneficiaries];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setBeneficiaries(next);
                      }}
                      placeholder="Beneficiary Full Name"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={ben.percentage}
                        onChange={(e) => {
                          const next = [...beneficiaries];
                          next[idx] = { ...next[idx], percentage: Number(e.target.value) };
                          setBeneficiaries(next);
                        }}
                        className="w-full pr-6 pl-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <span className="absolute right-2 top-1.5 text-xs text-slate-400">%</span>
                    </div>
                    {beneficiaries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBeneficiaries(beneficiaries.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Remove beneficiary"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Split Total Validation Bar */}
              <div
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isSplitValid
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <span>Total Allocation Split:</span>
                <span className="font-mono font-bold">
                  {totalPercentage.toFixed(0)}% {isSplitValid ? '✓ Valid (100%)' : '(Must equal 100%)'}
                </span>
              </div>
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {formError}
              </div>
            )}

            <button
              id="btn-save-account"
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              {editingId ? 'Update Account in Portfolio' : 'Save Account to Portfolio'}
            </button>
          </form>
        </div>

        {/* Portfolio Accounts Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Sole-Name Asset &amp; Beneficiary Schedule ({accounts.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify how each asset transfers at death and whether it bypasses NY Surrogate&apos;s Court probate.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Probate Bypass
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Probate / Alert
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {accounts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 text-2xl">
                  💼
                </div>
                <h4 className="text-sm font-bold text-slate-800">No accounts recorded yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  This plan starts with 0 accounts. Use the <strong>"Add Sole-Name Account"</strong> form on the left to enter your first bank, brokerage, or retirement account.
                </p>
              </div>
            ) : (
              accounts.map((acc) => {
                const isUnprotectedBrokerage =
                acc.accountType === 'Taxable Brokerage' &&
                acc.transferMechanism !== 'TOD (Transfer on Death)';
              const isUnprotectedBank =
                (acc.accountType === 'Checking Account' || acc.accountType === 'Savings / CD') &&
                acc.transferMechanism !== 'POD (Payable on Death / Totten Trust)';
              const isErisa = acc.accountType === 'Workplace 401(k)/Pension';
              const isProbate = acc.transferMechanism === 'None (Probate Asset)';

              return (
                <div
                  key={acc.id}
                  className={`p-4 transition-colors hover:bg-slate-50/80 ${
                    editingId === acc.id ? 'bg-sky-50/60' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{acc.nickname}</h3>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {acc.accountType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                          {acc.ownershipTitle}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {!isProbate ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {acc.transferMechanism}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Probate Asset (Counts toward $50k SCPA § 1301 Cap)
                          </span>
                        )}

                        {acc.perStirpes ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Per Stirpes: Yes
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            Per Stirpes: No
                          </span>
                        )}

                        {(isUnprotectedBrokerage || isUnprotectedBank) && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                            Missing {acc.accountType === 'Taxable Brokerage' ? 'TOD' : 'POD'}
                          </span>
                        )}

                        {isErisa && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-100 text-red-900 border border-red-300">
                            ERISA Spousal Consent Required
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-base font-bold font-mono text-slate-900">
                        {formatCurrency(acc.balance)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(acc)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete account"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Beneficiaries Row */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                      <Users className="w-3.5 h-3.5" /> Beneficiaries:
                    </span>
                    {acc.beneficiaries.map((b) => (
                      <span
                        key={b.id}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium"
                      >
                        {b.name} (<span className="font-mono">{b.percentage}%</span>)
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
