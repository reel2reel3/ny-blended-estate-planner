# NY Blended Estate Planner

A 100% client-side, privacy-first single-page web application designed for a married New York State resident (including Age 62+ blended-family planning) with children from a prior relationship who keeps assets in their sole name and wants 100% of their estate to pass to their children.

> **Privacy & Security:** Zero backend database or external API calls. All user data stays strictly in the user's browser (`localStorage`) or locally exported `.json` files. This public repository contains **software code and fictional demo defaults only — zero real personal data**.
>
> **Disclaimer:** Educational & organizational tool only. Not legal advice. Consult a licensed New York estate planning attorney before executing legal instruments.

---

## Key Files for Code & Feature Review

- **`ny_blended_estate_planner.html`** — Complete, self-contained single-file HTML/JS/Tailwind web app (can be downloaded and run locally in Chrome with zero build step).
- **`src/`** — Modular React + TypeScript + Tailwind CSS source code:
  - `src/types.ts` — Full TypeScript data model (`AssetAccount`, `ElectiveShareConfig`, `WillConfig`, `AttorneyPrepConfig`, `SavedPlanSlot`).
  - `src/defaultState.ts` — 62 New York counties, fictional baseline demo state, and zero-data `BLANK_ESTATE_STATE`.
  - `src/components/AssetTrackerTab.tsx` — **Tab 1: Asset & Probate-Bypass Tracker** (`SCPA § 1301` $50,000 Small Estate gauge, unprotected TOD/POD alerts, $0 liquidity buffer alert, ERISA 401(k) spousal consent warning, *per stirpes* toggle).
  - `src/components/ElectiveShareTab.tsx` — **Tab 2: NY Spousal Right of Election Simulator** (`EPTL § 5-1.1-A` testamentary substitute clawback calculator, pro-rata breakdown, Scenario A without waiver vs. Scenario B with deed-acknowledged waiver).
  - `src/components/BackupWillTab.tsx` — **Tab 3: DIY NY Backup Will Generator** (`EPTL § 3-2.1` physical-end signature block, `EPTL § 3-4.1` revocation, intentional omission of spouse, `EPTL § 11-1.1` executor powers, `SCPA § 1406` Self-Proving Affidavit, and 5-point execution guardrails checklist).
  - `src/components/AttorneyPrepTab.tsx` — **Tab 4: NY Attorney Visit Prep Packet (Full Age 62+ Suite)**:
    - Section A: Mutual Financial Disclosure Summary (Schedules A & B for postnuptial waiver).
    - Section B: Requested Legal Instruments — Mutual Waiver (`EPTL § 5-1.1-A(e)` / `DRL § 236(B)(3)` / `RPL § 309-a`), NY Statutory Short Form POA (`GOL § 5-1513`, 2 witnesses + notary, gifting modifications), NY Health Care Proxy (`PHL Art. 29-C`), Living Will (NY clear & convincing evidence + artificial nutrition/hydration), Stand-Alone HIPAA Authorization (`45 CFR § 164.508`), and NY Disposition of Remains Agent (`PHL § 4201`).
    - Section C: Age 62+ Long-Term Care / NY Medicaid Spousal Refusal & 5-Year Lookback (MAPT) + NY Real Estate Transfer Plan (`NY RPL § 424` Transfer on Death Deed / Trust).
    - Section D: Digital Assets (`NY EPTL Art. 13-A` / RUFADAA), Beneficiary Audit & Plain-English Family Letter of Instruction.
  - `src/components/HelpGuideTab.tsx` — **Tab 5: Help, Roadmap & Searchable NY Legal Glossary** (20 NY estate law terms + Top 3 Blended Family Mistakes).
  - `src/components/NewPlanModal.tsx`, `src/components/PlanManagerModal.tsx`, `src/components/SaveAsModal.tsx` — Clean-slate plan creation, multi-slot browser storage, and local JSON backup/restore.
