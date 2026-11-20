export type AccountType =
  | 'Traditional IRA'
  | 'Roth IRA'
  | 'Taxable Brokerage'
  | 'Checking Account'
  | 'Savings / CD'
  | 'Workplace 401(k)/Pension'
  | 'Personal Property';

export type OwnershipTitle = 'Sole Name' | 'Joint with Right of Survivorship' | 'Tenants in Common';

export type TransferMechanism =
  | 'Named IRA/Plan Beneficiary'
  | 'TOD (Transfer on Death)'
  | 'POD (Payable on Death / Totten Trust)'
  | 'None (Probate Asset)';

export interface BeneficiarySplit {
  id: string;
  name: string;
  percentage: number;
}

export interface AssetAccount {
  id: string;
  nickname: string;
  accountType: AccountType;
  balance: number;
  ownershipTitle: OwnershipTitle;
  transferMechanism: TransferMechanism;
  beneficiaries: BeneficiarySplit[];
  perStirpes: boolean;
}

export interface ElectiveShareConfig {
  useManualOverride: boolean;
  manualProbateAssets: number;
  manualTestamentarySubstitutes: number;
  estimatedExpenses: number;
}

export interface ChildRecord {
  id: string;
  fullName: string;
}

export interface ExecutionChecklist {
  printedCleanly: boolean;
  signedAtEnd: boolean;
  twoDisinterestedWitnesses: boolean;
  witnessesAddresses30Days: boolean;
  selfProvingNotarized: boolean;
}

export interface WillConfig {
  testatorName: string;
  county: string;
  spouseName: string;
  children: ChildRecord[];
  perStirpes: boolean;
  primaryExecutor: string;
  successorExecutor: string;
  executionChecklist: ExecutionChecklist;
}

export interface SpouseAssetItem {
  id: string;
  institution: string;
  accountType: string;
  balance: number;
}

export type CoAgentRule = 'Act Separately' | 'Act Jointly';

export type LivingWillPreference =
  | 'Comfort Care / No Artificial Prolongation'
  | 'Limited Trial of Life Support'
  | 'Maximum Life-Sustaining Measures';

export type ArtificialNutritionPreference =
  | 'Withhold / Withdraw if Terminal or Permanent Unconsciousness'
  | 'Provide Artificial Nutrition & Hydration'
  | 'Defer to Health Care Agent';

export type RealEstatePlanOption =
  | 'Not Applicable (No Real Estate)'
  | 'NY Transfer on Death Deed (RPL § 424)'
  | 'Revocable Living Trust'
  | 'Medicaid Asset Protection Trust (MAPT)';

export interface AttorneyPrepConfig {
  spouseAccounts: SpouseAssetItem[];
  requestMutualWaiver: boolean;
  requestStatutoryPoa: boolean;
  requestHealthCareProxy: boolean;
  poaPrimaryAgent: string;
  poaSuccessorAgent: string;
  poaCoAgentRule: CoAgentRule;
  poaGiftingModifications: boolean;
  poaGiftingNotes: string;
  hcpPrimaryAgent: string;
  hcpPrimaryPhone: string;
  hcpBackupAgent: string;
  hcpBackupPhone: string;
  consultationNotes: string;

  // Extended Medical & End-of-Life Directives
  requestLivingWill?: boolean;
  livingWillPreference?: LivingWillPreference;
  livingWillArtificialNutrition?: ArtificialNutritionPreference;
  requestHipaaRelease?: boolean;
  hipaaAuthorizedPersons?: string;
  requestDispositionOfRemains?: boolean;
  dispositionPrimaryAgent?: string;
  dispositionSuccessorAgent?: string;
  dispositionWishes?: string;

  // Age 62+ Long-Term Care, Medicaid & Real Estate Review
  discussMedicaidSpousalRefusal?: boolean;
  ownsNyRealEstate?: boolean;
  realEstatePlanOption?: RealEstatePlanOption;
  realEstateNotes?: string;

  // Digital Assets (NY EPTL Art. 13-A), Beneficiary Audit & Letter of Instruction
  includeDigitalAssetsClause?: boolean;
  appleLegacyContactSet?: boolean;
  googleInactiveManagerSet?: boolean;
  beneficiaryAuditVerified?: boolean;
  passwordManagerLocation?: string;
  originalDocumentsLocation?: string;
  keyContactsNotes?: string;
}

export interface EstatePlannerState {
  version: number;
  lastUpdated: string;
  accounts: AssetAccount[];
  electiveShare: ElectiveShareConfig;
  will: WillConfig;
  attorneyPrep: AttorneyPrepConfig;
}

export interface SavedPlanSlot {
  id: string;
  name: string;
  savedAt: string;
  state: EstatePlannerState;
}

export type ActiveTab =
  | 'assets'
  | 'elective-share'
  | 'will-generator'
  | 'attorney-prep'
  | 'help-guide';

