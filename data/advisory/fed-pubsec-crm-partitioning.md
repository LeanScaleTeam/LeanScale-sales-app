# Fed/PubSec CRM Partitioning — Advisory

## 1) Project Overview

### What is the name of this project?
Fed/PubSec CRM Partitioning - CRM Data Isolation & Compliance Infrastructure

### What is the purpose of this project?
This project creates logical or physical boundaries within the CRM to isolate Federal/Public Sector sales data from commercial sales data. The goal is to enforce compliance with regulations such as ITAR, FedRAMP, DFARS, and CMMC while enabling both sales segments to operate independently without data leakage. After this project, the client has an enforceable data isolation architecture with role-based access controls, audit trails, and documented compliance posture -- none of which existed before.

**Core transformation:** From a single CRM where any sales rep can access government-sensitive data, to a partitioned system where Fed/PubSec records are isolated behind RBAC controls, sharing rules, and audit logging that satisfy federal compliance requirements.

### What Fed/PubSec CRM Partitioning Unlocks

After this project is complete, the organization can:

- Pursue and bid on ITAR-controlled and CUI-sensitive government contracts with confidence that CRM data handling meets regulatory requirements
- Pass compliance audits (DFARS, CMMC, FedRAMP) for their CRM system without scrambling to build ad-hoc controls
- Operate dual sales motions (commercial + Fed/PubSec) within a single CRM ecosystem without data contamination
- Generate segment-specific pipeline reports and executive roll-ups that respect data boundaries
- Onboard new Fed/PubSec reps with pre-configured access that automatically enforces data isolation

### What business outcomes does this project drive?

**Primary Outcomes:**

- **Regulatory compliance enforcement:** CRM data handling meets ITAR, FedRAMP, DFARS, and CMMC requirements at the system level, reducing the risk of violations that carry penalties up to $1M per ITAR violation or $23,607 per invoice under the False Claims Act
- **Data isolation:** Zero unauthorized access paths between Fed/PubSec and commercial segments, verified through systematic access testing and data leakage audits
- **Operational independence:** Both sales segments can run their pipelines, reports, and workflows without interference or data contamination

**Secondary Outcomes:**

- Foundation for Salesforce Government Cloud migration if ITAR-controlled data requires GovCloud hosting
- Enables pursuit of larger government contracts that require demonstrated CRM compliance controls during vendor assessment
- Reduces cyber liability insurance premiums by documenting access controls and audit capabilities

### Who in the Org can benefit from this project?

VP of Sales Operations, RevOps Leader, Fed/PubSec Sales Director, Chief Compliance Officer, General Counsel, CRM Administrator, Fed/PubSec Account Executives, IT Security Lead

### Pain Points this Project Solves

| Pain Point | What Fed/PubSec CRM Partitioning Enables |
|---|---|
| "Any rep can see our government account data -- we have zero access control" | RBAC with profiles, permission sets, and sharing rules that restrict Fed/PubSec records to authorized users only |
| "We can't pass a compliance audit on our CRM data handling" | Documented data classification matrix, enforced sharing model, and audit trails that satisfy ITAR/DFARS/CMMC auditors |
| "Our integrations leak Fed/PubSec data into commercial marketing tools" | Segment-scoped integration users and data sync filters that prevent cross-segment data flow |
| "Edge case accounts keep falling through the cracks" | Defined classification rules, automation for tagging, and an escalation process for ambiguous accounts |
| "We lost a government contract bid because we couldn't demonstrate CRM compliance" | Fully documented partitioning architecture with test results showing zero data leakage |

### The Data Behind the Problem

The compliance risk of unsecured CRM data in government-facing businesses is substantial and growing:

- **83% of organizations** reported at least one insider threat incident in 2024, with insider threats accounting for nearly 60% of all data breaches. In a dual-segment CRM without partitioning, every commercial rep with system access is an unintentional insider threat to Fed/PubSec data.
- **ITAR violations** carry civil penalties up to $1,000,000 per violation and criminal penalties up to $1,000,000 and 20 years imprisonment. In October 2024, Raytheon agreed to pay over $950 million to resolve ITAR-related violations.
- **CMMC enforcement** began Phase I on November 10, 2025, with a three-year phase-in making compliance mandatory for all covered DoD contracts by November 2028. The DFARS final rule requires contractors to demonstrate compliance, not just self-attest.
- **False Claims Act penalties** for misrepresenting compliance reach $23,607 per invoice (2024 inflation-adjusted cap). A major defense contractor settled an FCA lawsuit for over $300 million in 2023 after falsely certifying NIST SP 800-171 compliance.
- **Average cost of a malicious insider breach** reached $4.92 million in 2025, with detection taking an average of 81 days.

### Key Metaphors or Frameworks

**The Firewall Metaphor:** CRM partitioning is a data firewall between your commercial and Fed/PubSec operations. Just as a network firewall controls traffic between zones, CRM partitioning controls data visibility between segments. Use this when explaining to non-technical executives why the project matters.

**When to use:** Sales conversations with VPs and C-suite who understand network security concepts but not CRM architecture.

**When NOT to use:** With CRM admins or technical stakeholders who need specifics on sharing rules and OWD settings -- they need the architecture details in the Methodology, not metaphors.

**The Zoning Metaphor:** Think of your CRM like a building with security clearance zones. Commercial reps have access to the main floor. Fed/PubSec reps have badge access to the restricted floor. Executive leadership has a read-only glass wall into both floors. This frames stakeholder access levels intuitively.

### Target Motion

Sales-Led Growth (SLG) with a dual-segment GTM motion -- companies running both commercial B2B and Federal/Public Sector sales teams from the same CRM. Typically outbound-driven on the Fed/PubSec side with long procurement cycles (6-18 months) and relationship-based selling.

_Not a fit for:_ Companies that sell exclusively to government (they should be on GovCloud from the start). Companies without any ITAR/DFARS/CMMC exposure (standard CRM segmentation is sufficient). PLG-only companies with no direct government sales motion.

### Common Belief Barriers

**"We can just create a few sharing rules and call it done."** -- Sharing rules are one layer of a multi-layer security model. Without proper OWD settings, profile restrictions, field-level security, integration user scoping, and export controls, sharing rules alone leave multiple data leakage paths. See Methodology for the full security layer stack.

**"We don't need a separate partitioning project -- our IT team can handle this."** -- CRM partitioning for federal compliance is not a standard admin task. It requires understanding both the CRM security model and the specific regulatory requirements (ITAR, DFARS, CMMC). Misconfiguration carries legal and financial consequences that far exceed the project cost. See the penalties data in "The Data Behind the Problem" above.

**"Can't we just use a separate CRM instance for Fed/PubSec?"** -- A separate instance is one valid approach, but it creates operational overhead (duplicate workflows, separate reporting, more admin burden) and doesn't always satisfy compliance requirements better than a well-partitioned single org. The right approach depends on the specific compliance frameworks involved -- see Methodology for the decision framework.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce (most common)**

Primary CRM where partitioning is implemented. Used for configuring profiles, permission sets, role hierarchy, OWD settings, sharing rules, record types, and field-level security that enforce data isolation.

**Salesforce Government Cloud (GovCloud)**

Dedicated Salesforce instance on AWS GovCloud (US) infrastructure. Required for organizations handling ITAR-controlled data or needing FedRAMP High, DoD IL4/IL5 authorization. Provides physically isolated infrastructure where data is processed and stored solely within the continental U.S. and operated by screened U.S. citizens.

**HubSpot (alternative)**

Secondary CRM option for companies not on Salesforce. HubSpot's partitioning capabilities rely on custom properties, teams, and permission sets rather than sharing rules and OWD settings. Less mature for federal compliance use cases but viable for non-ITAR scenarios.

**Data Providers (if applicable):**

- Account classification: Dun & Bradstreet (NAICS/SIC codes for government entity identification), SAM.gov (federal entity verification)
- Compliance tracking: Kiteworks, PreVeil (ITAR/CMMC compliance platforms that may integrate with the CRM)

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP Sales Operations / RevOps Leader (Executive Sponsor)**

- **Required for:** Strategy approval, go-live sign-off, resource allocation
- **Responsibilities:** Final decision on partitioning approach, budget approval, internal change management

**Fed/PubSec Sales Director (Segment Owner)**

- **Required for:** Discovery, user access requirements, data classification validation, UAT
- **Responsibilities:** Defines which records are Fed/PubSec, validates access testing, confirms operational workflows post-partition

**Chief Compliance Officer / General Counsel (Compliance Authority)**

- **Required for:** Compliance requirements definition, regulatory framework identification, audit sign-off
- **Responsibilities:** Specifies which regulations apply (ITAR, DFARS, CMMC, EAR), reviews data classification matrix, approves compliance documentation

**CRM Administrator (Technical Owner)**

- **Required for:** All implementation phases, ongoing maintenance post-handoff
- **Responsibilities:** Provides system access, assists with configuration, owns the partition long-term

### Technical Owners

**CRM Administrator (Primary Technical Owner)**

- Implements and maintains profiles, permission sets, sharing rules, and role hierarchy
- Manages user provisioning and segment assignments post-go-live
- Runs periodic access audits and remediates findings

**IT Security Lead (Secondary Technical Owner)**

- **Required when:** ITAR-controlled data or GovCloud migration is in scope
- Handles integration security review, API user permissions, and network-level controls

**Enterprise Considerations (If Applicable)**

- CISO approval may be required for any changes to data access controls
- Procurement/IT governance board review for GovCloud contract approval
- HR involvement if user background screening is required for Fed/PubSec data access

---

## 4) Scoping

### Scoping Factors

**1. Compliance Frameworks in Scope**

- ITAR only --> Likely requires GovCloud or separate instance; highest complexity
- DFARS/CMMC only --> Single-org partitioning with RBAC usually sufficient
- Multiple frameworks (ITAR + DFARS + CMMC) --> Full assessment needed; may require hybrid approach

**2. CRM Platform**

- Salesforce Enterprise+ --> Full sharing model available (OWD, sharing rules, profiles, permission sets)
- Salesforce Professional --> Limited sharing capabilities; may need upgrade
- HubSpot Enterprise --> Team-based partitioning possible but less granular
- Other CRM --> Custom assessment required

**3. Data Volume and Complexity**

- < 1,000 Fed/PubSec accounts --> Straightforward classification and migration
- 1,000-10,000 accounts --> Requires automated tagging and validation scripts
- > 10,000 accounts --> Significant data migration effort; consider phased rollout

**4. Integration Landscape**

- 0-3 integrations --> Standard scoping
- 4-10 integrations --> Each integration needs security review and scoped API users
- 10+ integrations --> Dedicated integration audit phase; add 20-30 hours

**5. Cross-Segment Collaboration Needs**

- Fully isolated segments --> Simpler architecture
- Shared pipeline reporting at executive level --> Requires dashboard running user configuration
- Account handoff process between segments --> Requires re-classification workflow and ownership transfer rules

**6. Existing CRM Security Posture**

- OWD already Private, roles configured --> Build on existing foundation
- OWD Public Read/Write, flat role hierarchy --> Significant foundational work before partitioning can begin

### Multiple Approaches

**Approach 1: Single-Org RBAC Partitioning**

- **Criteria:** DFARS/CMMC compliance (no ITAR); existing Salesforce Enterprise+ org; < 10 integrations; client prefers unified admin experience
- **Execution:** Configure OWD to Private, build parallel role hierarchy branches for Fed/PubSec and commercial, implement criteria-based sharing rules, add record types and field-level security

**Approach 2: GovCloud Migration + Partitioning**

- **Criteria:** ITAR-controlled data present; FedRAMP High authorization required; DoD IL4/IL5 data handling needed
- **Execution:** Provision Salesforce Government Cloud instance, migrate Fed/PubSec data to GovCloud, configure RBAC within GovCloud, establish limited data sync between commercial org and GovCloud for executive reporting

**Approach 3: Separate CRM Instance**

- **Criteria:** Regulatory requirement for physical data separation; very different sales processes between segments; client has admin capacity for two orgs
- **Execution:** Stand up separate CRM instance for Fed/PubSec, migrate relevant data, configure independent workflows, build cross-instance reporting (if permitted by compliance)

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Compliance Context**

- Which specific compliance frameworks apply to your Fed/PubSec data? (ITAR, FedRAMP, DFARS, CMMC, EAR, CUI) _(determines partitioning approach and whether GovCloud is required)_
- Have you undergone a compliance audit on your CRM data handling before? What were the findings? _(reveals known gaps and urgency)_
- Do you handle any ITAR-controlled technical data or defense articles information in the CRM? _(ITAR presence is the single biggest scope driver)_

**Current State**

- How are Fed/PubSec accounts currently identified in the CRM? Is there a field, record type, or naming convention? _(determines data migration complexity)_
- Who currently has access to Fed/PubSec account data? Is it restricted today in any way? _(baseline for access control gap analysis)_
- What are your current OWD settings and role hierarchy structure? _(determines how much foundational work is needed)_
- Which integrations touch Fed/PubSec data? (Marketing automation, BI tools, enrichment, APIs) _(each integration is a potential leakage path)_

**Operational Needs**

- Do any accounts span both commercial and Fed/PubSec segments? How should those be handled? _(edge case planning)_
- Does Fed/PubSec leadership need to see commercial pipeline data, or are the segments fully isolated? _(determines executive reporting architecture)_
- How do account handoffs between segments work today? _(re-classification workflow design)_

**Expectations and Constraints**

- Is there a compliance audit or contract deadline driving the timeline? _(urgency and phasing)_
- Does your legal team need to review and approve the partitioning design? _(adds review cycles to timeline)_
- Do you have a dedicated CRM admin who will own the partition post-implementation? _(handoff readiness)_

### Information to Gather Before Implementation

**CRM Access and Architecture:**

System Administrator access to Salesforce (or equivalent CRM) with permission to modify sharing settings, profiles, permission sets, role hierarchy, and record types. Export of current users with roles and profiles.

**Compliance Documentation:**

Written documentation of which compliance frameworks apply and any existing audit findings. Legal/compliance team confirmation of data classification requirements.

**Account Data:**

List or criteria for identifying which accounts are Fed/PubSec vs. commercial. For existing records, a classification spreadsheet or defined tagging logic.

**Integration Inventory:**

Complete list of systems that connect to the CRM with their authentication method (API user, OAuth, etc.) and which objects/fields they access.

### Approach Decision Questions

| Question | Answer --> Approach |
|---|---|
| Does the CRM contain ITAR-controlled data? | Yes = Approach 2 (GovCloud), No = Approach 1 (Single-Org RBAC) |
| Is physical data separation a regulatory requirement? | Yes = Approach 2 or 3 (GovCloud/Separate Instance), No = Approach 1 |
| Does the client have admin capacity for two CRM orgs? | Yes = Approach 3 viable, No = Approach 1 preferred |
| How many integrations touch Fed/PubSec data? | < 5 = Approach 1 manageable, 5-10 = Approach 1 with extended scope, 10+ = Consider Approach 2 or 3 |
| Is FedRAMP High or DoD IL4/IL5 required? | Yes = Approach 2 (GovCloud required), No = Approach 1 |

---

## 6) Overcoming Common Belief Barriers

### "We can just create a few sharing rules and call it done."

Sharing rules open access; they don't restrict it. In Salesforce, sharing rules can only grant additional access beyond OWD settings -- they cannot take access away. A compliant partition requires multiple layers working together: OWD set to Private as the baseline, role hierarchy branches that separate segments, profile-level object and field restrictions, sharing rules that grant access within each segment, integration users scoped to their segment, and export permission controls. Skipping any layer creates a data leakage path that will fail a compliance audit.

**The reframe:** "Sharing rules are one layer of five. Skipping the others is like locking the front door but leaving every window open."

### "We don't need a separate partitioning project -- our IT team can handle this."

IT teams can configure sharing rules and profiles. What they typically lack is the intersection of CRM security architecture expertise and federal compliance framework knowledge. A misconfigured OWD setting or an overlooked integration user can create a data leakage path that exposes ITAR-controlled data to unauthorized users. The penalties are not theoretical: ITAR violations carry civil penalties up to $1M per violation, and False Claims Act exposure for misrepresenting compliance reaches $23,607 per invoice. The project cost is a rounding error compared to a single violation.

**The reframe:** "This is not a CRM admin task -- it's a compliance architecture project that happens to be implemented in the CRM."

### "Can't we just use a separate CRM instance for Fed/PubSec?"

A separate instance is one valid approach, but it is not automatically the right one. Separate instances double the admin overhead (two sets of workflows, two reporting environments, two user provisioning processes) and create data synchronization challenges for executive reporting. For most DFARS/CMMC scenarios, a well-partitioned single org provides equivalent compliance posture with significantly less operational burden. The separate-instance approach is warranted primarily when (a) ITAR requires physical data separation, (b) FedRAMP High or DoD IL4/IL5 hosting is mandated, or (c) the Fed/PubSec sales process is fundamentally different enough to justify separate workflows.

**The reframe:** "Separate instance = higher compliance confidence for ITAR, but at 2x admin cost. Let's determine if your regulations actually require it before doubling your CRM overhead."

| Factor | Single-Org RBAC | Separate Instance / GovCloud |
|---|---|---|
| Admin overhead | Single org to manage | Two orgs to manage |
| Executive reporting | Native cross-segment views | Requires data sync or BI layer |
| ITAR compliance | May not satisfy requirements | Physical isolation satisfies |
| DFARS/CMMC compliance | Sufficient with proper RBAC | Exceeds requirements |
| Implementation time | 60-80 hours | 100-120+ hours |

### "Our data isn't that sensitive -- we're not a defense contractor."

Any company that sells to federal agencies, state/local government, or serves as a subcontractor to a prime government contractor may handle CUI (Controlled Unclassified Information) or FCI (Federal Contract Information). As of November 2025, the DFARS CMMC Final Rule requires contractors to demonstrate compliance for all applicable contracts involving CUI, FCI, and CDI. Even non-defense government contracts increasingly include data handling requirements. The question is not whether your data is "sensitive" in the abstract, but whether your contracts or subcontracts include compliance clauses.

**The reframe:** "If you sell to any federal entity or subcontract to someone who does, your CRM data handling is in scope for compliance. Check your contract clauses."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|---|---|---|---|
| Pipeline Production | Increase | +10-25% | Fed/PubSec team can pursue ITAR/CMMC-requiring contracts previously out of reach |
| Opp-to-CW Conversion | Increase | +5-15% | Compliance posture demonstrated during vendor assessment increases win rate on gov contracts |
| Gross Retention | Increase | +2-5% | Government contracts have high retention when compliance is maintained; partitioning prevents compliance-driven churn |

### Expected Outcomes

| Metric | Before | After | Source |
|---|---|---|---|
| Unauthorized cross-segment access paths | Unknown (untested) | Zero (verified by access testing matrix) | Internal security audit |
| Compliance audit readiness | Weeks of ad-hoc preparation | Documented and audit-ready within 24 hours | Post-implementation |
| Data leakage findings in security audit | Multiple expected (no controls in place) | Zero critical findings | Data leakage audit |
| Time to onboard new Fed/PubSec rep | Manual access provisioning (2-4 hours) | Profile-based provisioning (< 30 minutes) | Admin workflow |
| Integration data leakage incidents | Unmonitored | Zero (scoped integration users, filtered syncs) | Integration audit |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

- 100% of user roles pass the access testing matrix (each role sees only its segment's data)
- Zero data leakage findings in the internal security audit
- All integrations confirmed to respect partitioning boundaries
- Fed/PubSec and commercial dashboard totals match direct query validation

**Lagging Indicators (Proof of success, Month 2-6):**

- Clean compliance audit at 90 days post-go-live with zero access control findings
- Zero unauthorized access incidents logged in audit trail
- Fed/PubSec team reports full confidence in data isolation during day-to-day operations
- Successful pursuit of at least one government contract that requires demonstrated CRM compliance
- Admin self-sufficiency: client CRM admin handles user provisioning and edge cases without LeanScale support

---

## References

[1] ITAR Compliance: Common ITAR Violations & Fines - BigID

[2] CMMC Legal Risks: Why Compliance Protects Your Business - CyberSheath

[3] 83% of organizations reported insider attacks in 2024 - IBM

[4] 2025 Data Breach Investigations Report - Verizon

[5] ITAR Requirements: Consequences of Non-Compliance - Sharetru

[6] CMMC: New Era of Cybersecurity Compliance for Defense Contractors - Alston & Bird

[7] Insider Threat Statistics for 2025 - Syteca

[8] Salesforce Government Cloud - Salesforce

[9] Salesforce Architects - Platform Sharing Architecture
