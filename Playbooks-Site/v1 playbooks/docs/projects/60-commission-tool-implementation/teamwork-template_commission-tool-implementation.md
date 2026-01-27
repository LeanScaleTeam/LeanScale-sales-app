# Commission Tool Implementation - Project Details / Task List

**Tag:** `commission-tool`
**Total Hours:** 60h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: Commission Tool Implementation - 1. Discovery, Setup & Configuration
**Tag:** `commission-tool`
**Description:** Discovery, platform setup, integrations, and commission plan configuration for the commission tool implementation
**Hours:** 40h

### Task List: (Commission Tool) 1. Discovery & Platform Setup
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Commission Process | 2h | Assess how commissions are currently calculated, what tools are used, and where the pain points exist. End state: Documented current-state process with identified gaps and inefficiencies.<br /><br />• Interview Finance lead on current calculation process and timeline<br />• Review existing commission spreadsheets or tools in use<br />• Document current data sources (CRM, invoicing, HR) and how they're accessed<br />• Identify manual steps, bottlenecks, and error-prone areas<br />• Quantify the pain (hours spent, error rates, dispute frequency)<br />• Map all roles that receive commissions and their plan types |
| 2. Define Tool Requirements and Select Platform | 2.5h | Gather requirements for the commission tool and validate tool selection against client's tech stack and needs. End state: Tool selected (or confirmed) with requirements documented.<br /><br />• Document must-have integrations (Salesforce/HubSpot, QuickBooks/NetSuite, HRIS)<br />• List required features: multi-tier plans, accelerators, SPIFs, team-based credits<br />• Evaluate tool options if not already selected (QuotaPath, Spiff, CaptivateIQ, Xactly, Everstage, Qobra)<br />• Confirm tool compatibility with client's CRM and data structure<br />• Get procurement/budget approval if new tool purchase required<br />• Document custom objects and fields in CRM that impact commissions |
| 3. Gather Commission Plan Documentation | 2h | Collect all existing commission plan documents, quota structures, and crediting rules. End state: Complete commission plan inventory ready for configuration.<br /><br />• Collect current commission plan documents for all roles<br />• Document quota structures and attainment thresholds<br />• Map crediting rules (who gets credit for each deal type)<br />• Identify split credit scenarios and how they're handled<br />• Document accelerators, decelerators, and cap structures<br />• Note any SPIFs, bonuses, or non-standard compensation elements |
| 4. Configure Commission Tool Account and User Hierarchy | 3h | Set up the commission tool instance and establish the organizational hierarchy for commission tracking. End state: Tool account live with user hierarchy and roles configured.<br /><br />• Create commission tool account with admin credentials<br />• Set up organizational hierarchy (teams, managers, reporting structure)<br />• Create user accounts for sales reps, managers, and finance admins<br />• Configure role-based permissions (who can view/edit what)<br />• Set up manager-to-rep relationships for roll-up reporting<br />• Document admin credentials and access for client handoff |
| 5. Establish CRM Integration | 3.5h | Connect the commission tool to the CRM to pull opportunity and deal data automatically. End state: CRM connected with opportunity data flowing into commission tool.<br /><br />• Connect to Salesforce/HubSpot via native integration or OAuth<br />• Map opportunity fields to commission tool (Amount, Close Date, Stage, Owner)<br />• Configure which opportunity record types/stages trigger commission eligibility<br />• Map custom fields needed for crediting logic (deal type, product line, region)<br />• Set up sync frequency (real-time vs. scheduled)<br />• Test data flow with sample opportunities and verify accuracy |
| 6. Connect Finance and HR Systems | 3h | Integrate invoicing/ERP system for payout data and HRIS for employee data. End state: Full data ecosystem connected—CRM, Finance, and HR feeding commission tool.<br /><br />• Connect QuickBooks/NetSuite/invoicing system for bookings/payment data<br />• Map invoice fields to commission calculations (amount, date, customer)<br />• Connect HRIS for employee start dates, termination dates, role changes<br />• Configure how role changes impact quota proration<br />• Set up data refresh schedules for each integration<br />• Validate data consistency across all connected systems |

---

### Task List: (Commission Tool) 2. Plan Configuration & Data Migration
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Build Commission Plan Structures | 4h | Configure the commission plans for each role within the platform, including base rates, tiers, and quotas. End state: All active commission plans configured and ready for assignment.<br /><br />• Create plan templates for each sales role (AE, SDR, AM, SE overlay)<br />• Configure base commission rates and quota targets per role<br />• Set up attainment tiers (e.g., 0-80%, 80-100%, 100-120%, 120%+)<br />• Configure accelerators for over-quota performance<br />• Set up decelerators or caps if applicable<br />• Build SPIF structures for promotional periods |
| 8. Configure Crediting and Attribution Rules | 4h | Define how credit is assigned for deals—primary owner, splits, overlays, and team-based scenarios. End state: All crediting rules configured to handle every deal scenario.<br /><br />• Set up primary rep crediting (opportunity owner gets credit)<br />• Configure split credit rules for team selling scenarios<br />• Set up overlay crediting for SE, CSM, or partnership involvement<br />• Define territory-based vs. account-based credit assignment<br />• Configure how credit changes when reps are reassigned mid-deal<br />• Document and test edge cases (rep turnover, deal recycling) |
| 9. Configure Payout Timing and Adjustments | 3h | Set up when and how commissions are calculated, approved, and paid out. End state: Payout workflow configured from calculation through disbursement.<br /><br />• Set commission calculation frequency (monthly, bi-weekly)<br />• Configure payout timing relative to deal close/invoice date<br />• Set up clawback rules for cancelled deals or chargebacks<br />• Configure adjustment workflows (disputes, corrections, manual entries)<br />• Set up approval workflows (manager review, finance sign-off)<br />• Configure export format for payroll integration |
| 10. Prepare Historical Data for Migration | 3h | Extract and clean historical performance data from existing systems for import into commission tool. End state: Clean historical data file ready for import.<br /><br />• Pull historical closed-won opportunities from CRM (12-24 months)<br />• Extract historical quota assignments by rep and period<br />• Gather historical commission payments from Finance records<br />• Clean and normalize data (consistent date formats, rep names, amounts)<br />• Map historical data fields to commission tool import format<br />• Identify and resolve data gaps or inconsistencies |
| 11. Import Historical Data and Validate | 3h | Load historical data into commission tool and verify accuracy against source records. End state: Historical data loaded with verified accuracy for back-testing.<br /><br />• Import historical opportunities/deals into commission tool<br />• Load historical quota assignments for each rep<br />• Run commission calculations on historical periods<br />• Compare calculated commissions to actual historical payouts<br />• Identify and resolve discrepancies (typically reveals configuration issues)<br />• Document any known variances and their explanations |

---

## Milestone 2: Commission Tool Implementation - 2. Validation & Rollout
**Tag:** `commission-tool`
**Description:** Testing, validation, training, and launch of the commission tool
**Hours:** 20h

### Task List: (Commission Tool) 3. Validation & Rollout
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 12. Run End-to-End Calculation Tests | 3h | Execute test cycles across all plan types to verify calculation accuracy before go-live. End state: All calculation scenarios tested and verified accurate.<br /><br />• Create test scenarios for each commission plan type<br />• Run calculations for at-quota, under-quota, and over-quota scenarios<br />• Test accelerator calculations at each tier threshold<br />• Verify split credit calculations distribute correctly<br />• Test edge cases (rep changes, deal amendments, clawbacks)<br />• Document test results and get Finance sign-off on accuracy |
| 13. Validate User Access and Reports | 2h | Confirm all users can access their appropriate views and reports function correctly. End state: All users verified with correct access; reports validated.<br /><br />• Test rep view—verify reps see only their own data<br />• Test manager view—verify managers see team roll-ups<br />• Test finance admin view—verify full access and export capabilities<br />• Validate standard reports (attainment, payout summary, forecast)<br />• Test dashboard accuracy against source data<br />• Confirm mobile access works (if applicable) |
| 14. Conduct Pilot with Select Users | 2.5h | Run the system with a small group of pilot users before full rollout to catch any issues. End state: Pilot complete with feedback incorporated and system ready for full launch.<br /><br />• Select 3-5 pilot reps across different plan types<br />• Run live commissions for pilot users for one pay period<br />• Gather feedback on accuracy, usability, and visibility<br />• Address any issues identified during pilot<br />• Get pilot user sign-off that calculations match expectations<br />• Document lessons learned for full rollout |
| 15. Train Finance and RevOps Admins | 3h | Enable the admin team to manage the commission tool ongoing, including plan changes, adjustments, and reporting. End state: Admin team fully trained and capable of self-service management.<br /><br />• Conduct admin training session (60-90 minutes)<br />• Cover plan configuration and modification procedures<br />• Train on adjustment and dispute resolution workflows<br />• Review reporting and export capabilities for payroll<br />• Walk through common maintenance tasks (new hires, role changes, plan updates)<br />• Provide admin quick-reference guide |
| 16. Train Sales Managers | 2h | Enable managers to use the tool for team performance visibility and coaching. End state: Managers trained to leverage commission data for performance management.<br /><br />• Conduct manager training session (30-45 minutes)<br />• Cover team performance dashboards and drill-down views<br />• Show how to track individual rep attainment and forecast<br />• Train on reviewing and approving adjustments (if applicable)<br />• Demonstrate how to answer rep questions using the tool<br />• Provide manager quick-reference guide |
| 17. Launch to Sales Team | 2h | Roll out the commission tool to all sales reps with training on self-service access. End state: All reps onboarded and using the system for earnings visibility.<br /><br />• Schedule all-hands training session (20-30 minutes)<br />• Cover how to access the tool and navigate dashboards<br />• Show reps how to view earnings, quota attainment, and payout history<br />• Explain what's auto-calculated vs. what requires manual input<br />• Address FAQs and common concerns<br />• Send recording and quick-reference guide to all reps |
| 18. Hand Off to Client | 3.5h | Transfer full ownership of the commission tool to the client team with complete documentation. End state: Client self-sufficient with admin access, documentation, and support contacts.<br /><br />• Transfer admin credentials and ownership to client RevOps/Finance<br />• Deliver documentation package (configuration settings, integration details, troubleshooting guide)<br />• Document vendor support contacts and escalation paths<br />• Schedule 30-day check-in for post-launch review<br />• Provide recommendations for ongoing maintenance cadence<br />• Close out project and confirm client acceptance |

---

## Summary
- **Total Milestones:** 2 (40h + 20h)
- **Total Task Lists:** 3 (consolidated from 6 Parts)
- **Total Tasks:** 18 (one per Step)
- **Total Hours:** 60h
- **Generated from:** playbook_commission-tool-implementation.md
- **Generated on:** 2025-12-31
