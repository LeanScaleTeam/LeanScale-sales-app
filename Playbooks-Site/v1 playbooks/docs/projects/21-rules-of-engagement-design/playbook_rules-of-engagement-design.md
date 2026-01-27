# Rules of Engagement Design - Playbook

## 1. Definition

**What it is**: A strategic documentation project that creates clear, enforceable policies defining how sales representatives interact with leads, accounts, and opportunities. Delivers a comprehensive ROE document covering ownership rules, dispute resolution processes, and CRM enforcement configurations.

**What it is NOT**: Not Sales Territory Design (geographic/industry segmentation). Not Lead Routing implementation (technical automation). Not Commission Plan Design (compensation structures). Not CRM customization (field/object changes beyond ROE enforcement).

## 2. ICP Value Proposition

**Pain it solves**: Sales teams waste time on ownership conflicts, deals fall through the cracks due to unclear rules, rep morale suffers from perceived unfairness, and customers get confused by multiple reps reaching out. Without documented ROE, managers spend excessive time arbitrating disputes instead of coaching.

**Outcome delivered**: Comprehensive, documented rules of engagement covering all scenarios (inbound, outbound, existing customer, partner deals) with clear escalation paths and CRM enforcement. Sales reps know exactly who owns what, disputes are resolved quickly via established processes, and customer experience improves.

**Who owns it**: VP of Sales or Head of Sales Operations. Typically sponsored by CRO with input from RevOps.

## 3. Implementation Procedure

### Part 1: Discovery & Scenario Mapping

#### Step 1: Audit Current State and Pain Points

**Step Overview:** Assess existing ROE documentation (if any) and identify current ownership conflicts and pain points. End state: Gap analysis showing what rules exist, what's missing, and quantified conflict frequency.

- Review any existing ROE documentation, wiki pages, or tribal knowledge
- Pull data on ownership disputes from past 90 days (Slack threads, manager escalations, Salesforce reassignments)
- Interview 2-3 sales leaders on most common conflict scenarios
- Interview 3-5 sales reps to understand frontline frustrations
- Document which scenarios cause the most friction (inbound overlap, account poaching, partner conflicts)
- Quantify the problem: number of disputes per month, time spent resolving, deals lost to confusion

#### Step 2: Map All ROE Scenarios

**Step Overview:** Create comprehensive list of all scenarios requiring rules of engagement coverage. End state: Complete scenario matrix organized by deal type and lifecycle stage.

- List inbound lead scenarios (form fills, demo requests, content downloads, event leads)
- List outbound prospecting scenarios (cold outreach to net-new accounts, named accounts, existing customer subsidiaries)
- List existing customer scenarios (upsell/cross-sell, expansion within parent/child hierarchies)
- List partner/channel scenarios (partner-sourced leads, co-selling, deal registration)
- List edge cases: dormant opportunities, recycled leads, ownership timeouts, segment changes
- Prioritize scenarios by frequency and conflict potential

---

### Part 2: ROE Design & Drafting

#### Step 1: Define Core Ownership Rules

**Step Overview:** Establish the fundamental rules for account and opportunity ownership across all scenarios. End state: Draft ownership rules covering who owns what and for how long.

- Define account ownership criteria (first touch, named account assignment, territory-based)
- Set opportunity ownership rules (who creates opp, who advances opp, splits for handoffs)
- Establish ownership duration limits (30/60/90 day windows for inactive opps)
- Define criteria for ownership transfer (stage gates, inactivity thresholds)
- Document parent-child account rules (subsidiary ownership follows parent vs. independent)
- Create clear rules for segment handoffs (SMB to MM, MM to Enterprise)

#### Step 2: Draft Scenario-Specific ROE

**Step Overview:** Write specific, actionable rules for each mapped scenario with examples. End state: Draft ROE document with rules for every identified scenario.

- Write inbound lead ownership rules (round-robin vs. territory-based vs. account-matched)
- Write outbound prospecting rules (named account protections, cooling-off periods)
- Write upsell/expansion rules (AE vs. CSM vs. AM ownership boundaries)
- Write partner deal rules (deal registration windows, sourced vs. influenced credit)
- Include 2-3 concrete examples per rule to reduce interpretation ambiguity
- Use if/then language: "IF [condition], THEN [owner] owns for [duration]"

#### Step 3: Define Escalation and Dispute Resolution

**Step Overview:** Establish clear processes for handling disputes and edge cases. End state: Documented escalation path with decision-makers and SLAs.

- Define first-line dispute resolution (rep-to-rep conversation with 24hr window)
- Establish manager escalation process (Sales Manager as first arbiter)
- Define final arbiter role (typically VP Sales or RevOps Lead)
- Set SLAs for dispute resolution (24-48 hours max)
- Document split mechanisms for legitimate overlap (percentage splits, double-comp scenarios)
- Create appeal process for edge cases not covered by rules

---

### Part 3: Stakeholder Review & Finalization

#### Step 1: Review with Sales Leadership

**Step Overview:** Present draft ROE to sales leadership for feedback, refinement, and approval. End state: Leadership-approved ROE document ready for team rollout.

- Schedule review session with VP Sales and Sales Managers (60-90 min)
- Walk through each scenario category and proposed rules
- Stress-test rules against historical disputes (would this rule have resolved it?)
- Gather feedback on edge cases and unclear language
- Document all requested changes and rationale
- Revise draft and get final sign-off from VP Sales

#### Step 2: Get Team Buy-In and Communicate

**Step Overview:** Roll out final ROE to sales team with clear communication and acknowledgment. End state: All reps have read, understood, and acknowledged ROE.

- Create executive summary (1-pager) of key rules for quick reference
- Schedule team-wide ROE rollout meeting (30-45 min)
- Walk through major rules with examples and rationale
- Address questions and concerns from reps
- Have all reps sign/acknowledge they've read and understood ROE
- Store final document in accessible location (wiki, Notion, Google Drive)

---

### Part 4: CRM Enforcement & Handoff

#### Step 1: Configure CRM Enforcement Settings

**Step Overview:** Implement CRM configurations that support and enforce ROE where possible. End state: CRM settings aligned with ROE for automated enforcement.

- Configure ownership timeout automation (reassign inactive opps after X days)
- Set up validation rules to prevent unauthorized ownership changes
- Configure alerts for potential ROE violations (duplicate outreach to same account)
- Build report/dashboard showing ownership disputes and resolution
- Test automation with sample scenarios before enabling
- Document all CRM configurations for future maintenance

#### Step 2: Create Monitoring Plan and Hand Off

**Step Overview:** Establish ongoing monitoring process and transfer ownership to client team. End state: Client self-sufficient with ROE monitoring and update cadence.

- Define ROE review cadence (quarterly recommended)
- Assign ROE owner within client organization (typically RevOps or Sales Ops)
- Create dispute tracking log/report for ongoing monitoring
- Document process for proposing ROE changes as organization evolves
- Transfer all documentation to client (ROE doc, CRM configs, monitoring reports)
- Schedule 30-day check-in to review initial effectiveness

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with basic account and opportunity structure
- Defined sales team structure (roles, segments, territories if applicable)
- Access to historical dispute data or manager insights on conflicts
- Stakeholder availability for interviews and review sessions

**What client must provide:**
- Access to sales leadership (VP Sales, Sales Managers) for interviews and approval
- Access to 3-5 sales reps for frontline input
- Existing ROE documentation or tribal knowledge (if any)
- Decision on final arbiter for disputes
- CRM admin access for enforcement configurations

## 5. Common Pitfalls

- **Pitfall 1**: Rules too vague or open to interpretation → **Mitigation**: Use specific if/then language and include 2-3 concrete examples for every rule
- **Pitfall 2**: No team buy-in before rollout → **Mitigation**: Have reps acknowledge ROE before territory distribution; get leadership sign-off visible to team
- **Pitfall 3**: ROE designed without considering data quality → **Mitigation**: Ensure CRM data (industry, revenue, employee count) is clean enough to enforce rules; address data gaps first
- **Pitfall 4**: No clear escalation path → **Mitigation**: Document exactly who resolves disputes and with what SLA; identify final decision-maker before rollout

## 6. Success Metrics

- **Leading Indicator**: Reduction in ownership disputes escalated to management within 30 days of rollout (target: 50% reduction)
- **Lagging Indicator**: Zero ambiguous ownership situations causing deal delays or lost revenue within 90 days; rep satisfaction with fairness in quarterly survey

---

