---
displayed_sidebar: inDepthSidebar
title: "Automated Inbound Post Support"
sidebar_position: 4
---

# Automated Inbound Support

Dependencies - Pitfalls - Success Metrics - Maintenance - AI Usage - Edge Cases

## Dependencies & Inputs

### What Must Exist Before Starting

- **CRM (Salesforce or HubSpot)** with admin access
- **Defined ICP criteria** and lead scoring model (even if basic)
- **Lead routing rules** documented (to understand what fields drive routing)
- **Budget approved** for enrichment tool subscription
- **Inbound lead forms** operational and generating leads

### What Client Must Provide

| Input | Why Needed |
|-------|------------|
| CRM admin access and sandbox environment | Testing |
| Export of recent inbound leads | Gap analysis |
| Documentation of current scoring model and routing rules | Understand baseline |
| List of stakeholders for requirements gathering | Alignment |
| Decision-maker for tool selection approval | Sign-off |

---
displayed_sidebar: inDepthSidebar

## Deliverables

### Final Deliverables

**Clay Tables:**
- Inbound lead enrichment table with webhook receiver
- Enrichment waterfall configured (80%+ match rate target)
- Tier assignment logic

**CRM Configuration:**
- Lead routing workflows (tier-based)
- Timing logic (business hours vs off-hours)
- Sequence enrollment triggers
- Lead rerouting rules for unworked leads

**Sequences:**
- Primary inbound follow-up sequence
- "Didn't book" Calendly follow-up
- Off-hours automated response
- High-value exception handling

**Documentation:**
- Channel map with intent tiers
- Routing decision tree
- Sequence structure (steps, timing, methods)
- Copywriting requirements for client

---
displayed_sidebar: inDepthSidebar

## Common Pitfalls

### Pitfall 1: Enriching Without Fixing Existing Data Quality

**Problem:** Adding enrichment on top of duplicate or corrupted data amplifies problems.

**Mitigation:** Recommend basic deduplication before enrichment implementation or scope dedup as Phase 0.

### Pitfall 2: "Set and Forget" Mentality

**Problem:** Teams configure enrichment and never monitor it, missing when match rates drop or credits run out.

**Mitigation:** Build monitoring dashboard and alerts as part of implementation, not afterthought.

### Pitfall 3: Over-Enriching with Too Many Fields

**Problem:** Requesting every possible field bloats the CRM and confuses users.

**Mitigation:** Start with 10-15 high-impact fields that drive decisions, expand later based on usage.

---
displayed_sidebar: inDepthSidebar

### Pitfall 4: No Overwrite Governance

**Problem:** Enriched data overwrites manually-verified data, frustrating reps who lose their research.

**Mitigation:** Document and configure overwrite rules before go-live, protect key manual fields.

### Pitfall 5: Poor Team Adoption

**Problem:** Reps don't trust enriched data and continue manual research.

**Mitigation:** Validate accuracy during testing, share results with team, show time savings in training.

### Pitfall 6: Copywriting Scope Creep

**Problem:** The project inherently involves copywriting decisions (how many steps, what messaging).

**Mitigation:** Structure work is in scope; client writes their own copy. Establish this boundary early.

### Pitfall 7: The Ecosystem Challenge

**Problem:** Automated inbound can't be fully segmented as standalone. Everything interconnected (Market Map + ICP + lead routing touches lead lifecycle).

**Mitigation:** Use "border disputes" as opportunity: "We already got head start on this, want to keep going with bigger picture?"

---
displayed_sidebar: inDepthSidebar

## Success Metrics

### Power 10 Metrics Impacted

| Metric | Impact Direction | Expected Magnitude |
|--------|------------------|-------------------|
| MQL → Opp Conversion | ↑ Increase | 2-3x (Companies following up within 1 hour see 53% conversion vs 17% after 24 hours) |
| Opp → CW Cycle Time | ↓ Decrease | 15-30% (AI-driven enrichment enables 30% faster deal closure) |

### Expected Outcomes

| Metric | Before | After |
|--------|--------|-------|
| Average response time | 42-47 hours | Under 5 minutes |
| Lead qualification rate | Baseline | +21x improvement |
| Inbound conversion rate | Baseline | +17-23% |
| Rep time on admin | 70% of week | Reduced by 30-50% |
| Off-hours lead capture | Delayed to next day | Instant |

---
displayed_sidebar: inDepthSidebar

### How to Measure Success

**Leading Indicators (Week 1-4):**
- Enrichment match rate >75% on new leads within first week
- SDRs report reduced research time per lead
- Webhook firing correctly (100% of form fills)
- Routing accuracy (leads going to right rep)
- Sequence enrollment rate

**Lagging Indicators (Month 2-6):**
- Speed-to-lead improves by 50%+ within 30 days
- Lead scoring model accuracy improves
- Average speed-to-lead (target: under 5 min for T1)
- Lead-to-meeting conversion rate
- MQL-to-SQL conversion rate

---
displayed_sidebar: inDepthSidebar

## Maintenance Schedule

### Weekly Tasks
- Monitor webhook success rate
- Sequence performance review
- Speed-to-lead audit (sample 10 leads)

### Monthly Tasks
- Clay credit monitoring
- Routing accuracy audit (20 random leads)
- Sequence copy refresh
- High-value exception review

### Quarterly Tasks
- MQL criteria validation
- Enrichment provider optimization
- Decision tree review
- Add new inbound channels
- Data refresh cycle (re-enrich records older than 60-90 days)

### After 1 Sales Cycle (30-90 Days)
- Conversion analysis by tier
- Speed-to-lead correlation
- Sequence refinement
- Routing refinement

---
displayed_sidebar: inDepthSidebar

## AI Usage

### Current AI Applications

**Claygent for Custom Enrichment**

Claygent is Clay's AI web scraper that pulls real-time context from the web.

Common inbound enrichment prompts:
- "Visit this company's website. Are they B2B or B2C?"
- "Based on the page URL, what product category was this person viewing?"
- "Is this a PLG trial signup or marketing form fill based on the form source?"
- "Does this company mention SOC-II compliance on their website?"

**Response Classification**
- AI categorizes inbound responses: interested, not interested, competitor, wrong person
- Helps prioritize human follow-up on engaged leads

### Future AI Opportunities

- **Intelligent Timing Optimization:** AI analyzes best response times by segment
- **Enhanced Intent Scoring:** AI scores intent based on page views, content consumed
- **Message Personalization at Scale:** Use enrichment data to generate personalized opening lines

---
displayed_sidebar: inDepthSidebar

## Edge Cases & Troubleshooting

### Webhook Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Webhook Not Firing | Leads in CRM but not Clay | Check workflow active, verify n8n/Zapier connection |
| Data Not Processing | 200 response but no enrichment | Check payload structure, auth token |
| Record Limit Reached | 403 Forbidden error | Create new webhook table (50k limit) |

### Enrichment Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Personal Emails | No company enrichment | Add fallback logic, route to lower-tier sequence |
| Enrichment Too Slow | Over 60-second target | Reduce providers in waterfall, prioritize T1 |
| Overwriting Manual Data | Rep changes lost | Add "manual override" checkbox field |

---
displayed_sidebar: inDepthSidebar

### Routing Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Wrong Rep Assignment | T1 goes to SDR instead of AE | Audit routing rules, check enrichment timing |
| Existing Customer Gets Prospecting | Customer fills form, gets sales sequence | Add exclusion criteria before enrollment |
| Duplicate Leads | Same person enrolled multiple times | Add deduplication check |
| Off-Hours Delayed Too Long | 9pm lead waits until 10am | Tighten automated response timing |

### Special Scenarios

| Scenario | Solution |
|----------|----------|
| Multiple forms in one day | Dedupe based on 24-hour window, aggregate signals |
| Competitor filling forms | Maintain competitor domain blacklist |
| Bot/Spam submissions | Add CAPTCHA, honeypot fields, domain validation |
| Partner referral channel | Route to partner manager instead of direct sales |
| Enterprise requires legal review | Exception routing with procurement flag |

---
displayed_sidebar: inDepthSidebar

## QA Checklist

### Webhook QA
- [ ] Webhook fires on each inbound channel
- [ ] Clay table receives data correctly
- [ ] All expected fields populated

### Enrichment QA
- [ ] Firmographic data populates
- [ ] Tier assignment calculates correctly
- [ ] Data pushed back to CRM
- [ ] Speed: enrichment under 60 seconds

### Routing QA
- [ ] T1 leads route to human (business hours)
- [ ] T1 leads get automated + queue (off-hours)
- [ ] T2/T3 leads route to automation
- [ ] High-value exceptions trigger alarms
- [ ] Unworked leads reroute after threshold

### Sequence QA
- [ ] Sequences enroll correctly
- [ ] Emails send from correct source
- [ ] Timing/cadence correct
- [ ] Unsubscribe/opt-out working

### Edge Case QA
- [ ] Personal email handling
- [ ] Existing customer handling
- [ ] Existing opportunity handling
- [ ] Duplicate lead handling

---
displayed_sidebar: inDepthSidebar

## Related Projects

### Post-Automated Inbound Projects

| Project | Trigger | Scope |
|---------|---------|-------|
| Lead Routing Optimization | Routing gaps revealed | Dedicated routing refinement |
| Lead Lifecycle Cleanup | MQL definitions unclear | Fix stages and criteria |
| Automated Outbound | Inbound working, want outbound | Similar Clay architecture |
| Signal-Based Workflows | Want to layer intent signals | Job postings, funding, competitor moves |

### Integration with Other GTM Projects

**Market Map Integration:**
- If Market Map exists: reference it for tiering
- If not: simplified tiering built here can inform future Market Map
- Key field: Account tier (T1/T2/T3) should be consistent

**Territory Design Integration:**
- Lead routing rules should align with territory assignments
- Changes to territories should trigger routing rule updates

**ABM Integration:**
- High-value accounts identified in ABM can trigger exception routing
- ABM signals can supplement enrichment data
