# Lead Routing — Methodology

## 1) Core Concepts

### The Routing Hierarchy

**What is it?**

The routing hierarchy is the decision tree that determines how a lead gets assigned to a person. It defines which criteria are checked first, second, third — and what happens at each branch. A hierarchy might check: Federal overlay first, then Enterprise/SMB split, then Geography, then Industry, then make the assignment.

**Why does it matter?**

The hierarchy is the blueprint for the entire routing system. Without it clearly defined, the routing flow has no logic to follow. The hierarchy comes from the Sales Territory project — Lead Routing implements it technically.

**Key insight:**

> "Lead routing is the 'implementation' of territory design. Without territory definitions, routing will be inconsistent."

Sales Territory = What the territories are (theoretical). Lead Routing = How leads get assigned to those territories (implementation). This distinction is critical because teams often try to skip the territory design step and jump straight to routing. That creates a system where nobody agrees on who should get what, and every routing decision becomes ad hoc.

**Examples:**

| Context | How the Hierarchy Applies |
|---------|--------------------------|
| Enterprise SaaS with geographic territories | Hierarchy: Region > State > City > Round robin within city. Each layer narrows the pool until a single owner is identified. |
| Multi-product company with industry specialization | Hierarchy: Product line > Industry vertical > Company size > Assignment. Product determines the team, industry determines the rep. |
| SMB high-volume company with flat team | No hierarchy needed. Round robin distributes leads equally across a single pool. The hierarchy is effectively one node. |

**Common misunderstandings:**

* **Misconception:** The routing hierarchy is the same as the org chart. **Reality:** The routing hierarchy reflects how the _market_ is segmented, not how the team reports internally. An SDR manager and an AE manager may sit in different parts of the org chart but share routing logic based on territory.

* **Misconception:** You can design the hierarchy as you build the routing flow. **Reality:** The hierarchy must be designed _before_ routing is built. This is the Sales Territory project. Designing it during the build creates rework and conflicting logic.

---

### The Salesforce Territory Object (Custom "Vlookup Table")

**What is it?**

A custom Salesforce object that stores territory definitions and assignments in records, which the routing flow references for decision-making. Instead of hardcoding routing rules in flows, the flow "pings" this object to find the matching territory record and assigns accordingly. LeanScale developed this approach as an alternative to hardcoded routing flows or expensive dedicated tools like LeanData.

**Why does it matter?**

It decouples the routing logic from the routing data. Changes to territories (new hires, departures, rebalancing) can be made by updating records in the object, without touching flow code. This is the difference between a system that requires a Salesforce admin for every team change versus one where an ops manager can make updates directly.

**Key insight:**

> "What we mean when we talk about implementing territories in the system is really a Vlookup table that we put in Salesforce..."

**The Framework:**

```
Traditional Approach (Hardcoded):
Lead In -> Flow Decision Node -> Hardcoded "If State = CA, assign to Rep A" -> Assignment
Problem: Every change requires editing the flow itself

Territory Object Approach:
Lead In -> Flow looks up Territory Object -> Finds matching record -> Reads assignment from record -> Assignment
Advantage: Changes happen in the object records, not the flow code
```

**How it works in practice:**

1. Create a custom object in Salesforce to store territory records
2. Each record contains: Territory name (e.g., "Enterprise California Tech"), criteria fields (size, geography, industry, product), assigned team members (AE, SDR, etc.)
3. The routing flow pings the object to find a matching record based on lead criteria
4. Assignment happens based on what is stored in the matching territory record

> "Instead of using routing using the traditional Salesforce infrastructure, it pings the object first, goes, oh, here's what I need to fill out based on the territory information..."

**Examples:**

| Context | How the Territory Object Applies |
|---------|----------------------------------|
| Rep leaves the company | Update the territory record to replace "Rep A" with "Rep B." No flow changes needed. |
| New territory created after expansion | Add a new record to the territory object with criteria and assignments. The flow picks it up automatically. |
| Territory rebalancing after a reorg | Update criteria fields and assignments across affected records. The flow logic stays unchanged. |

**Common misunderstandings:**

* **Misconception:** You need LeanData or a dedicated tool for territory-based routing. **Reality:** The Salesforce Territory Object provides territory-based routing without extra cost, though it has limitations at scale (10+ reps, frequent changes, PTO automation needs).

* **Misconception:** Salesforce's native Territory Enterprise Management is the same thing. **Reality:** Salesforce has a native "Territory Enterprise Management" (now called Sales Territories) solution, but it is a sharing/access mechanism — it controls who can _see_ accounts, not who gets _assigned_ leads. It does not support triggers on territory associations and is limited to Account and Lead objects. LeanScale's custom object approach is purpose-built for assignment routing.

* **Misconception:** The Territory Object approach is a permanent solution at any scale. **Reality:** It works well for teams under ~10 reps with stable composition. Beyond that, the manual maintenance (especially PTO handling) becomes burdensome enough to justify dedicated tooling.

---

### Round Robin vs. Territory-Based vs. Target Account

**What is it?**

Three distinct approaches to lead routing, each suited to different organizational contexts. They are not always mutually exclusive — Target Account is almost always a hybrid with territory or round robin as a fallback.

**Why does it matter?**

Choosing the wrong approach creates either unnecessary complexity (territory-based for a 5-person flat team) or unfair distribution (round robin for a specialized enterprise team). The approach determines the level of effort to build, the ongoing maintenance cost, and the prerequisites required.

**The Framework:**

| Approach | Core Logic | Prerequisite | Maintenance |
|----------|-----------|--------------|-------------|
| Round Robin | Next person in rotation gets the lead | None | Minimal |
| Territory-Based | Lead criteria match territory definitions, assigned to territory owner | Sales Territory project | High |
| Target Account | Named accounts go to assigned owners, everything else falls back | Sales Territory project + named account list | Medium |

**Round Robin**

The simplest approach. Leads distribute sequentially across a pool of reps. No criteria matching, no territory definitions — just "next in line." Self-balancing when people join or leave (just add/remove from the pool).

Fair on _quantity_ but not on _quality_. Every rep gets the same number of leads, but the quality of those leads is random. In high-volume, low-ACV environments, the law of large numbers smooths this out. In low-volume, high-ACV environments, luck has outsized impact.

> "If you're working on an enterprise world, you're getting like five leads a month, you get three bad ones..."

**Territory-Based**

The most common approach. Leads route based on matching criteria (geography, industry, company size, product) against predefined territory definitions. Fair on _market opportunity_ because territories are designed to be balanced (through the Sales Territory project).

This approach requires the Sales Territory project to be complete first. The routing flow implements the hierarchy designed in that project. Without territory definitions, routing decisions are arbitrary.

**Target Account / Named Account**

A hybrid approach. High-value named accounts route directly to their assigned owners. Everything else falls back to either territory-based or round robin routing. Cannot exist in isolation — there must always be a fallback for leads that are not on the named account list.

**Key distinction on fairness:**

> "If you're dealing with a team that is largely flat, everybody sells every product, right? Something like a round robin makes sense"

The fairness model differs by approach:

* **Round Robin:** Equal quantity of leads per rep (not equal quality)
* **Territory-Based:** Equal market opportunity per rep (planned through Sales Territory)
* **Target Account:** Strategic assignment of highest-value accounts (not about equal distribution)

---

### The Sales Territory Dependency

**What is it?**

For Territory-Based and Target Account routing, the Sales Territory project must be completed before Lead Routing can begin. Sales Territory defines the theoretical territory structure (what segments exist, who owns what). Lead Routing translates that into technical automation.

**Why does it matter?**

This is the most common blocker for lead routing projects. Teams want routing without having done the territory design work. The result is either:

* Building routing that nobody agrees on (because territories were never formally defined)
* Rework when territory definitions change mid-build
* Falling back to round robin by default (which may not fit the team's needs)

**Key insight:**

> "Every good lead routing project starts with a really good territory project."

Sales Territory = What the territories are (theoretical). Lead Routing = How leads get assigned to those territories (implementation). Round robin is the only approach that does not require a completed territory project.

**Examples:**

| Context | What Happens Without Territory Design |
|---------|---------------------------------------|
| Team wants geographic routing but has not defined regions | Builder has to define regions during implementation, creating scope creep and stakeholder debates |
| Team has informal territories but nothing documented | Routing gets built to match informal understanding, which different stakeholders disagree on |
| Team decides to skip territory project for speed | Round robin is the only viable option, even if the team has specialized roles |

**Common misunderstandings:**

* **Misconception:** Territory definitions are part of the lead routing project. **Reality:** Territory design is a separate project with its own stakeholders, analysis, and deliverables. Lead routing _consumes_ territory design as an input.

* **Misconception:** We can do a "light" territory-based routing without a full territory project. **Reality:** You need at minimum a documented hierarchy and assignment map. If those do not exist, you are designing territories on the fly — which is the Sales Territory project, whether you call it that or not.

---

### The Maintenance Burden

**What is it?**

Lead routing systems (especially territory-based) require ongoing maintenance proportional to team size and change frequency. This is not a "set it and forget it" project. Every hire, departure, PTO absence, territory adjustment, and reorg requires updates to the routing system.

**Why does it matter?**

Clients consistently underestimate the ongoing investment required. At scale, lead routing maintenance can become a significant operational cost — potentially a part-time or full-time role.

**Key insight:**

At one client engagement, the ops lead spent roughly 40 hours a month working on lead routing adjustments, maintaining a working change log document that was updated daily with patch notes.

This is the most taxing ongoing project in the LeanScale portfolio for territory-based implementations at scale.

**The Framework:**

| Approach | Maintenance Level | Key Tasks | Estimated Hours/Month |
|----------|------------------|-----------|----------------------|
| Round Robin | Minimal | Add/remove from rotation | 1-2 hours |
| Territory-Based (small, <10 reps) | Moderate | Team changes, PTO coverage, territory updates | 5-10 hours |
| Territory-Based (large, 10+ reps) | High | Change logs, daily PTO coverage, new hires/departures, territory rebalancing | 20-40+ hours |
| Target Account | Medium | Named list updates + fallback maintenance | 3-8 hours |

**Examples:**

| Context | Maintenance Reality |
|---------|-------------------|
| 5-person SDR team with round robin | Nearly zero maintenance. Someone leaves, remove them. Someone joins, add them. |
| 15-person AE team with geographic territories | Every hire requires territory object updates. Every departure requires redistribution. PTO requires manual exclusion and re-inclusion. Expect 10-20 hours/month. |
| 50-person sales org with LeanData | Dedicated resource managing routing full-time. Daily change log updates. Calendar integration handles PTO but territory changes still require manual work. |

**Common misunderstandings:**

* **Misconception:** Once routing is built, it runs itself. **Reality:** Routing logic does not change on its own. Every team change, territory adjustment, or PTO absence requires someone to update the system. Without dedicated maintenance, routing degrades over time.

* **Misconception:** Dedicated tools eliminate maintenance. **Reality:** Tools like LeanData automate _some_ maintenance (PTO via calendar integration) but do not eliminate it. Territory changes, new hires, and rebalancing still require manual updates.

---

### The Transition Band-Aid Pattern

**What is it?**

The Salesforce Territory Object is often used as a transition mechanism between a simple system (like Round Robin) and a more advanced system (like LeanData). It provides territory-based routing without the cost and complexity of dedicated tooling, with the understanding that it may need to be replaced as the team scales.

**Why does it matter?**

Clients growing from simple to complex routing do not always need to jump straight to expensive tools. The territory object is a cost-effective middle step that can last years for teams that stay within its sweet spot.

**Key insight:**

At one engagement, the territory object approach was implemented early on and has remained unchanged for about three years since it first went live — proving it can be a durable solution at the right scale.

**Examples:**

| Context | How the Pattern Applies |
|---------|------------------------|
| Growing startup (8 reps, adding 2-3/year) | Start with Territory Object. Upgrade to LeanData when team hits 15+ and PTO management becomes painful. |
| Stable mid-market team (12 reps, low turnover) | Territory Object may be the permanent solution. Low change frequency means maintenance stays manageable. |
| Fast-scaling company (10 reps now, doubling in 6 months) | Skip the Territory Object. Go directly to LeanData — the maintenance burden will outpace the object approach within months. |

---

## 2) Decision Frameworks

### Approach Selection Matrix

| Situation | Recommended Approach | Why |
|-----------|-------------------|-----|
| Small team (<10), flat structure, high volume, low ACV | Round Robin | Simple, self-balancing, no prerequisites |
| Growing team (10+), specialized roles, geographic/industry segments | Territory-Based | Equality through market opportunity planning, allows specialization |
| Named/key accounts needing dedicated owners | Target Account (Hybrid) | Important accounts get right owners; fallback handles the rest |
| No Sales Territory project done, but team wants segmented routing | Round Robin (or do Sales Territory first) | Cannot implement territory routing without territory definitions |
| Budget-constrained, stable team (<10), moderate complexity | Salesforce Territory Object | Territory routing without LeanData cost |
| High turnover, 10+ reps, PTO coverage critical | Dedicated Tool (LeanData) | Automated availability handling, in-app management UI |
| Speed-to-lead is primary concern (booking meetings from forms) | Chili Piper | Better for inbound scheduling and form-based routing |
| Complex multi-object routing, Salesforce-only stack | LeanData | Purpose-built for Salesforce with lead-to-account matching |

### Scoping Factors

**1. Team Size**

The single most important factor in determining approach and tooling complexity.

* <10 people -> CRM-native flows or Territory Object sufficient
* 10+ people -> Dedicated tool recommended
* 25+ people -> Dedicated tool likely required, may need dedicated maintenance resource

> "I think 10 is probably a good number" for when tools become necessary

**2. Team Structure**

Determines whether leads need matching criteria or just equal distribution.

* Flat (everyone sells everything) -> Round Robin viable
* Specialized (SDRs, industry teams, product specialists) -> Territory-Based required

> "If you're dealing with a team that is largely flat, everybody sells every product, right? Something like round robin makes sense"

**3. Deal Volume & Size**

Determines whether round robin's randomness is acceptable.

* High volume, low ACV -> Round Robin works well (law of large numbers smooths out quality differences)
* Low volume, high ACV -> Round Robin unfair (luck has outsized impact on individual performance)

> "If you're working on an enterprise world, you're getting like five leads a month, you get three bad ones..."

**4. Sales Territory Prerequisite**

The hard gate that determines which approaches are available.

* Round Robin -> Not required
* Territory-Based -> **Required**
* Target Account -> **Required**

If the client wants territory-based routing but has no territory project: recommend completing Sales Territory first, or fall back to Round Robin as an interim solution.

**5. Change Frequency**

Determines whether manual maintenance is viable or tooling is needed.

* Low turnover, stable team -> CRM-native or Territory Object works
* High turnover, frequent changes -> Dedicated tool (LeanData) justified by time savings

---

### CRM-Native vs. Dedicated Tool Decision

Use this framework when the approach has been selected (Territory-Based or Target Account) and the question is _how_ to implement it.

| Aspect | Hardcoded Flow | Territory Object | LeanData |
|--------|----------------|-----------------|----------|
| Change management | Edit flow code | Update object record | In-app UI |
| Who can update | Admin/Developer | Anyone with object access | Anyone with license |
| PTO handling | Manual flow edit | Manual record edit | Automated via calendar integration |
| Cost | Free (CRM-native) | Free (CRM-native) | Expensive (dedicated license) |
| Best for | Very simple, static routing (<5 reps) | Small-medium teams (5-10 reps), moderate changes | Large teams (10+), frequent changes |
| Lead-to-account matching | Not included | Not included | Built-in |
| Multi-channel routing | Per-channel flows | Per-channel flows | Unified routing logic |
| Calendar/availability sync | None | None | Google/Outlook calendar sync |

**Decision shortcut:**

* Can a non-technical ops person make routing changes? -> Territory Object or LeanData
* Does the team need automated PTO handling? -> LeanData
* Is budget a constraint? -> Territory Object
* Are there fewer than 10 reps with low turnover? -> Territory Object
* Are there 10+ reps or frequent changes? -> LeanData

**Note on Chili Piper vs. LeanData:** These tools serve overlapping but different primary use cases. Chili Piper excels at speed-to-lead (inbound form submission to booked meeting). LeanData excels at complex routing logic within Salesforce. Some implementations combine both — Chili Piper for the booking experience, LeanData for the routing logic underneath.

---

### Approach Detail: Round Robin

**Best for:**

* High volume, low ACV environments
* Flat team structures where everyone sells the same product
* Young or immature sales teams without defined territories
* Situations where no Sales Territory project has been completed

**Not recommended for:**

* Specialized teams with industry, product, or geographic focus
* Low-volume, high-ACV environments (luck has outsized impact)
* Organizations that need to track territory-level performance

**Key differences from Territory-Based:**

| Aspect | Territory-Based | Round Robin |
|--------|-----------------|------------|
| Fairness model | Equal market opportunity | Equal lead count |
| Prerequisites | Sales Territory project | None |
| Maintenance | High (proportional to team size) | Minimal (add/remove reps) |
| Specialization | Supports specialized roles | Does not account for specialization |
| Quality distribution | Planned (territories designed for balance) | Random (luck of the draw) |

---

### Approach Detail: Territory-Based

**Best for:**

* Most common approach. Clear geographic, industry, or segment definitions
* Teams with specialized roles (SDRs, industry AEs, product specialists)
* Organizations that need fair distribution based on market opportunity
* Mid-size to large teams (10+)

**Not recommended for:**

* Teams without completed Sales Territory design
* Very small, flat teams where round robin suffices
* Organizations without capacity for ongoing maintenance

**Key differences from Round Robin:**

| Aspect | Round Robin | Territory-Based |
|--------|------------|-----------------|
| Setup complexity | Low (hours) | High (days to weeks) |
| Ongoing maintenance | Minimal | Significant |
| Scaling behavior | Add/remove from pool | Territory rebalancing required |
| PTO handling | Remove from rotation | Manual or tool-automated coverage |

---

### Approach Detail: Target Account (Hybrid)

**Best for:**

* Organizations with named/key accounts that need dedicated ownership
* ABM (Account-Based Marketing) motions where specific accounts are strategic priorities
* Combined with territory-based or round robin as fallback for non-named leads

**Not recommended for:**

* As a standalone approach (always needs a fallback)
* Organizations without a maintained named account list
* Small teams without strategic account differentiation

**Key structural requirement:**

Target Account routing always has two layers:

1. **Named account check:** Is this lead from a named/target account? If yes, route to the assigned owner.
2. **Fallback:** If no, route via territory-based or round robin.

This means a Target Account implementation includes the full build of whichever fallback approach is selected.

---

## 3) Benchmarks & Standards

> **Note:** This is a qualitative/process project. Benchmarks are light — focused on team size thresholds, tool selection thresholds, and maintenance hour estimates rather than quantitative scoring models.

### How to Use Benchmarks

**Benchmarks are guidelines, not rules. Always:**

1. Start with benchmark as baseline
2. Adjust based on client-specific data
3. Validate against their actual numbers when available
4. Document deviations and rationale

### Lead Response Time Benchmarks

Lead routing directly impacts speed-to-lead, which has well-documented effects on conversion rates.

| Metric | Data Point | Source |
|--------|-----------|--------|
| Average B2B lead response time | 42 hours | Kixie analysis of B2B response data |
| Percentage of companies responding in 5+ days | 55% | Kixie, multiple industry studies |
| Percentage of leads that never get contacted | Up to 73% | Industry aggregate data |
| Conversion lift from 1-minute response vs. baseline | 391% | InsideSales.com Lead Response Study |
| Lead qualification odds: 5 min vs. 30 min | 21x more likely to qualify | MIT/InsideSales.com study |
| Leads contacted in first hour vs. after 24 hours | 60x more likely to qualify | Harvard Business Review study of 2.24M leads |
| Customers buying from first responder | 78% | Industry survey data |

**Interpretation:**

* Lead routing removes a manual bottleneck between lead creation and rep contact. Even the best routing logic is worthless if leads sit in a queue waiting for manual assignment.
* The gap between average response (42 hours) and best practice (under 5 minutes) represents the window where proper routing automation pays for itself.

### Team Size Thresholds

| Team Size | Routing Complexity | Recommended Tooling | Maintenance Estimate |
|-----------|-------------------|-------------------|----------------------|
| 1-5 reps | Low | CRM-native round robin or simple flow | 1-2 hrs/month |
| 5-10 reps | Moderate | Salesforce Territory Object or CRM-native flows | 5-10 hrs/month |
| 10-25 reps | High | Dedicated tool recommended (LeanData) | 10-25 hrs/month |
| 25+ reps | Very High | Dedicated tool required, may need dedicated resource | 25-40+ hrs/month |

### Tool Selection Thresholds

| Question | Signal | Recommended Action |
|----------|--------|-------------------|
| Team size above 10? | Dedicated tool territory | Evaluate LeanData or Chili Piper |
| PTO coverage causing pain? | Automation needed | LeanData (calendar integration) |
| More than 2 team changes per quarter? | Manual maintenance unsustainable | Move from Territory Object to dedicated tool |
| Budget for $15K-50K+/year in tooling? | Dedicated tool feasible | Compare LeanData vs. Chili Piper for use case fit |
| Salesforce-only stack with complex routing? | LeanData sweet spot | LeanData |
| HubSpot CRM? | Limited dedicated tool options | HubSpot-native workflows or evaluate Default, Chili Piper |

---

## 4) Edge Cases & Deep Dives

### Edge Case 1: Missing Routing Criteria

**Scenario:** A lead comes in that does not match any defined territory or routing rule. The routing flow has no branch for this lead type, so it falls through unassigned or gets misrouted.

**Challenge:** This is not a theoretical problem. At one engagement, investors were routed to a product sales team because the routing criteria did not account for non-target-market companies. The routing system had no concept of "this lead does not fit any of our defined customer segments."

**Approach:**

1. **Always build a fallback/default routing path.** Every routing flow must have a "catch-all" branch that handles leads matching no defined territory.
2. **The fallback should route to a triage queue or default round robin** — not simply discard or ignore the lead.
3. **Monitor the fallback bucket.** If a significant percentage of leads hit the fallback, it signals missing territory definitions that need to be added.

> "There shouldn't in theory for most companies be anything that's just not getting touched"

**Validation:** After deploying, check the fallback queue weekly for the first month. If more than 5-10% of leads are hitting the fallback, the territory definitions need expansion.

---

### Edge Case 2: PTO Handling Across Approaches

**Scenario:** A team member goes on PTO and leads continue routing to them. Leads pile up unworked, response times spike, and the rep returns to a backlog that is mostly stale.

**Approach by tool:**

| Tool/Approach | PTO Handling Method | Effort | Risk |
|---------------|-------------------|--------|------|
| Round Robin (any tool) | Remove from rotation temporarily, re-add on return | Low (manual) | Forgetting to re-add |
| CRM-native flows (hardcoded) | Edit the flow to exclude the rep, edit again on return | High (admin-only) | Forgetting to revert; flow errors |
| Territory Object | Update territory record to reassign temporarily, revert on return | Medium (manual) | Forgetting to revert |
| LeanData | Automated via Google/Outlook calendar integration | None (automatic) | Calendar not synced; PTO not entered in calendar |

**Validation:** During QA, test the PTO scenario explicitly: mark a rep as out, send a test lead, verify it routes to coverage. Then re-enable the rep and verify they receive leads again.

---

### Edge Case 3: Team Changes (New Hires and Departures)

**Scenario:** A new team member joins and needs to be added to routing, or a team member leaves and needs to be removed immediately.

**New Hire:**

* **Round Robin:** Add to rotation pool. No other changes needed.
* **Territory-Based:** Add to territory assignments. May require territory rebalancing if the new hire is taking over part of an existing territory.
* **Target Account:** Add to named account assignments if applicable.

**Departure:**

* **Round Robin:** Remove from rotation immediately.
* **Territory-Based:** Remove from routing immediately. Redistribute territory coverage to remaining reps. Leads to a departed rep's territory will go unworked until routing is updated.
* **Target Account:** Reassign all named accounts.

**Validation:** After any team change, run test leads through the affected routing paths to confirm they reach active reps.

---

### Edge Case 4: The "No Territory Project" Scenario

**Scenario:** The client wants territory-based or segmented routing, but no Sales Territory project has been completed.

**Approach:**

1. **Assess whether informal territory definitions exist.** Some teams have territory concepts in spreadsheets that were never formalized. If stakeholders agree on them, document them formally before building.
2. **If no territory definitions exist at all:** Recommend completing a Sales Territory project first.
3. **If the client refuses:** Fall back to Round Robin — the only approach that does not require territory definitions.
4. **Hybrid option:** Implement Round Robin immediately while the Sales Territory project runs in parallel. Once territories are defined, upgrade to Territory-Based.

---

### Edge Case 5: Override Conflicts

**Scenario:** Manual overrides (sales leadership assigns a lead to a specific rep outside of routing rules) conflict with automated routing.

**Approach:**

1. **Build override logic into the flow.** The first check in any routing flow should be: "Is there a manual override?" If yes, skip all routing logic and leave the assignment as-is.
2. **Use a checkbox field** (e.g., "Routing Override" on the Lead object) that signals the flow to bypass routing.
3. **Document override usage.** If overrides become frequent (>5% of leads), it signals that the routing rules need adjustment.

> "It checks for an override. If the override is true, then just leave it be."

**Validation:** Test with a lead that has the override checkbox checked. Verify the routing flow does not change the assignment. Then test with the checkbox unchecked and verify the flow routes normally.

---

### Edge Case 6: Stale Enrichment Data

**Scenario:** Lead data used for routing (industry, company size, geography) is missing, incorrect, or outdated, causing misrouting.

**Approach:**

1. **Verify enrichment pipeline upstream.** Lead Routing should not be built or launched until the data feeding it is reliable.
2. **Build routing to handle missing data gracefully.** If a required routing field is blank, route to the fallback/default path rather than letting the lead stall.
3. **Monitor for routing failures caused by data gaps.** Track which routing criteria are most often missing and work with the enrichment team to address.

**Validation:** Create test leads with intentionally blank routing fields. Verify they route to the fallback path rather than stalling or erroring.

---

## References

* [Salesforce Territory Management - Salesforce Ben](https://www.salesforceben.com/territory-management-in-salesforce-10-things-you-need-to-know/)
* [Chili Piper vs LeanData Comparison](https://www.chilipiper.com/compare/chili-piper-vs-leandata)
* [LeanData vs Chili Piper](https://www.leandata.com/leandata-vs-chili-piper/)
* [Speed to Lead Response Time Statistics - Kixie](https://www.kixie.com/sales-blog/speed-to-lead-response-time-statistics-that-drive-conversions/)
* [Response Time Matters - InsideSales.com](https://www.insidesales.com/response-time-matters/)
* [HBR - The Short Life of Online Sales Leads](https://hbr.org/2011/03/the-short-life-of-online-sales-leads)
