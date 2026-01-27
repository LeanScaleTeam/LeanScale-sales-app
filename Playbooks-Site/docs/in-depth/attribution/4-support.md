---
displayed_sidebar: inDepthSidebar
title: "Attribution Post Support"
sidebar_position: 4
---

# Attribution Support

Dependencies & Inputs - Common Pitfalls - Success Metrics - Maintenance

## Dependencies & Inputs

### What Must Exist Before Starting

- **Marketing automation platform** (HubSpot, Marketo) connected to CRM
- **CRM with campaign object** or equivalent (Salesforce Campaigns, HubSpot Campaigns)
- **Web analytics** (Google Analytics or equivalent) with conversion tracking
- **Minimum 6 months of historical lead/opportunity data** for baseline analysis
- **Basic form infrastructure** capturing leads into CRM

---
displayed_sidebar: inDepthSidebar

### What Client Must Provide

| Input | Who Provides | Why Needed |
|-------|--------------|------------|
| Admin access to CRM and marketing automation | RevOps/IT | Configure fields, automation, reports |
| List of all active marketing campaigns and channels | Marketing | Map current state and build taxonomy |
| Access to stakeholders for buyer journey interviews | Marketing + Sales | Understand touchpoint flow |
| Decision on attribution model selection | VP Marketing | After LeanScale recommendation |
| Current UTM parameter usage documentation | Marketing Ops | Understand existing tracking |

---
displayed_sidebar: inDepthSidebar

## Common Pitfalls

### Pitfall 1: Implementing Last-Click Only Because It's Simpler

**Problem:** Teams default to last-touch attribution because it's easier to implement, missing 90%+ of influencing activities in complex B2B buying.

**Reality:** B2B buying involves 6-10 stakeholders consuming multiple touchpoints over months. Last-touch only shows the final interaction, making it impossible to understand what drove awareness and consideration.

**Mitigation:** Start with a multi-touch model (even linear) from day one. The incremental effort to implement is minimal compared to the insight gained.

---
displayed_sidebar: inDepthSidebar

### Pitfall 2: Ignoring Anonymous Website Visitors

**Problem:** 97% of website visitors don't fill out forms, so their touchpoints are invisible to attribution.

**Reality:** Many high-intent buyers research extensively before converting. Without account identification tools, you can only attribute converting visitors.

**Mitigation:** Set clear expectations with stakeholders that attribution will only cover converting visitors unless account identification tools (Clearbit Reveal, 6sense) are implemented. Consider this as a future enhancement.

---
displayed_sidebar: inDepthSidebar

### Pitfall 3: Siloed Data Across Online and Offline Channels

**Problem:** Offline touchpoints (events, sales calls, direct mail) aren't tracked in the same system as digital touchpoints.

**Reality:** Enterprise deals especially involve significant offline engagement - conferences, dinners, executive briefings - that influence the deal.

**Mitigation:** Include offline touchpoints in the attribution model by:
- Syncing Outreach/Salesloft activity data to CRM campaigns
- Creating manual campaign membership for event attendance
- Building a process for sales to log key offline interactions

---
displayed_sidebar: inDepthSidebar

### Pitfall 4: No Governance for Ongoing UTM and Source Hygiene

**Problem:** After launch, teams create new UTMs without following standards, data quality degrades over time.

**Reality:** Marketing teams change frequently, new campaigns launch weekly, and without governance the clean taxonomy gets polluted.

**Mitigation:**
- Create a UTM taxonomy document and URL builder tool
- Assign a single owner (usually RevOps or Marketing Ops) for attribution data quality
- Review source values monthly and clean up inconsistencies
- Add UTM standards to campaign launch checklist

---
displayed_sidebar: inDepthSidebar

### Pitfall 5: Focusing on Individual Leads Instead of Account-Level Engagement

**Problem:** Attribution tracks individual lead touchpoints, but B2B buying involves multiple people at the same account.

**Reality:** A deal might have 5 contacts who each engaged with different content. Lead-level attribution shows fragmented picture; account-level shows the full story.

**Mitigation:** For complex B2B deals with buying committees:
- Ensure attribution tracks all contacts on an account
- Build account-level influence rollup reports
- Consider account-based attribution models for enterprise segment

---
displayed_sidebar: inDepthSidebar

## Success Metrics

### Leading Indicators

| Metric | Target | Timeline |
|--------|--------|----------|
| New leads with first-touch source populated | 100% | Within 30 days of go-live |
| UTM compliance on new campaigns | 100% | Within 30 days |
| Campaign members auto-associated to opportunities | >90% | Within 60 days |
| Marketing team trained and using dashboards | All key users | Within 30 days |

---
displayed_sidebar: inDepthSidebar

### Lagging Indicators

| Metric | Target | Timeline |
|--------|--------|----------|
| Marketing can report pipeline contribution by channel | Yes, with confidence | 90 days |
| Attribution data included in QBR/board deck | Yes | Next QBR cycle |
| Budget decisions reference attribution data | Yes | Next planning cycle |
| Sales/marketing alignment on lead quality | Improved | 90 days |

---
displayed_sidebar: inDepthSidebar

### How to Measure Success

**Short-term (30 days):**
- Are first-touch fields populating on all new leads?
- Are UTM parameters being captured from forms?
- Is the marketing team using the attribution dashboards?

**Medium-term (90 days):**
- Can marketing answer "which channels drive pipeline?" with data?
- Are Campaign Influence records being created on opportunities?
- Has attribution data changed any budget decisions?

**Long-term (6+ months):**
- Is attribution data a standard part of QBRs and board reporting?
- Has marketing ROI visibility improved stakeholder confidence?
- Are there fewer sales/marketing disagreements about lead quality?

---
displayed_sidebar: inDepthSidebar

## Maintenance Schedule

### Monthly Tasks

| Task | Owner | Time Required |
|------|-------|---------------|
| Review new Lead Source values for normalization | RevOps | 30 min |
| Audit UTM compliance on recent campaigns | Marketing Ops | 30 min |
| Validate attribution accuracy on 5 recent closed-won | RevOps | 1 hour |
| Review dashboard usage and refresh as needed | RevOps | 30 min |

---
displayed_sidebar: inDepthSidebar

### Quarterly Tasks

| Task | Owner | Time Required |
|------|-------|---------------|
| Full Lead Source taxonomy review and cleanup | RevOps + Marketing | 2 hours |
| Attribution model performance review | VP Marketing + RevOps | 1 hour |
| Update UTM taxonomy for new channels/campaigns | Marketing Ops | 1 hour |
| Stakeholder training refresh | RevOps | 1 hour |
| Attribution accuracy audit (20+ opportunities) | RevOps | 2 hours |

---
displayed_sidebar: inDepthSidebar

### Annual Tasks

| Task | Owner | Time Required |
|------|-------|---------------|
| Full attribution model review and potential redesign | VP Marketing + RevOps | 4-8 hours |
| Benchmark against new tool capabilities | RevOps | 2 hours |
| Consider lookback window adjustments | RevOps | 1 hour |
| Archive old campaigns and clean historical data | Marketing Ops | 4 hours |

---
displayed_sidebar: inDepthSidebar

## Troubleshooting Guide

### Common Issues and Resolutions

| Issue | Likely Cause | Resolution |
|-------|--------------|------------|
| First-touch fields blank on new leads | Form not capturing UTMs, automation not firing | Check hidden form fields, validate workflow |
| Campaign Influence records not creating | Contact Roles missing on opportunities | Enable Contact Role requirement, add automation |
| Attribution credit doesn't sum to 100% | Model configuration issue | Review attribution model settings |
| Reports show duplicate revenue | Same opportunity counted multiple times | Check report grouping and filters |
| UTMs being stripped on redirect | Landing page not passing params | Fix redirect to preserve query strings |
| Salesforce Campaign Influence not working | Feature not enabled, wrong model | Check Setup → Campaign Influence settings |

---
displayed_sidebar: inDepthSidebar

## Related Projects

### Upstream Dependencies

| Project | Relationship |
|---------|--------------|
| **Marketing Automation Implementation** | Must exist - attribution relies on campaign tracking |
| **CRM Setup** | Must exist - attribution lives in CRM |
| **Web Analytics** | Should exist - provides additional touchpoint data |

### Downstream Projects

| Project | Relationship |
|---------|--------------|
| **Revenue Intelligence / BI** | Uses attribution data for advanced reporting |
| **Marketing Budget Optimization** | Uses attribution to inform channel investment |
| **ABM Program Design** | Account-level attribution informs ABM targeting |
| **Lead Scoring Refinement** | Attribution data can inform scoring weights |

---
displayed_sidebar: inDepthSidebar

## Final Deliverables Checklist

### Documentation
- [ ] UTM taxonomy document with naming conventions
- [ ] Lead Source value dictionary
- [ ] Attribution model technical specification
- [ ] Troubleshooting guide
- [ ] Training recording and quick-reference guide

### CRM Configuration
- [ ] First-touch fields created and automation live
- [ ] Lead Source normalization rules active
- [ ] Attribution model configured
- [ ] Campaign Influence working
- [ ] Core reports and dashboards built

### Governance
- [ ] Attribution owner assigned (typically RevOps)
- [ ] Maintenance schedule documented
- [ ] 30-day check-in scheduled
- [ ] Stakeholder sign-off on accuracy
