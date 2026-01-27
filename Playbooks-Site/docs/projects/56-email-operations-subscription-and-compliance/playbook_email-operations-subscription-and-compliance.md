# Email Operations: Subscription & Compliance Framework - Playbook

## 1. Definition

**What it is**: A technical implementation project that establishes comprehensive email subscription management within a Marketing Automation Platform (HubSpot or Marketo), including subscription type configuration, preference centers, opt-in/opt-out automation, and GDPR/CCPA compliance mechanisms.

**What it is NOT**: Not legal advisory services (LeanScale does not provide legal advice). Not a full data privacy program implementation. Not email deliverability optimization. Not email template design or content strategy.

## 2. ICP Value Proposition

**Pain it solves**: Marketing teams lack consistent opt-in/opt-out tracking, risking regulatory violations (GDPR fines up to €20M, CAN-SPAM fines of $50,120 per email). As companies scale internationally, managing consent across regions becomes complex, and manual processes lead to compliance gaps and legal exposure.

**Outcome delivered**: Robust subscription type framework with automated preference management, documented consent tracking, GDPR/CCPA-compliant processes, and a self-service preference center. Marketing operates confidently knowing email operations meet regulatory requirements.

**Who owns it**: VP of Marketing, Marketing Operations Manager, or RevOps Leader.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Requirements

#### Step 1: Audit Current Subscription Management

**Step Overview:** Evaluate existing opt-in/opt-out processes, subscription types, and consent tracking in the current MAP. End state: Gap analysis document identifying compliance risks and missing capabilities.

- Pull current subscription type configuration from HubSpot/Marketo
- Review existing opt-in mechanisms (forms, landing pages, import processes)
- Assess how consent is currently tracked (field-level, timestamps, source)
- Identify any existing preference center or unsubscribe flow
- Document which regions/countries the client markets to (GDPR, CCPA applicability)
- Interview marketing team on current pain points and known compliance gaps

#### Step 2: Define Subscription Type Requirements

**Step Overview:** Work with stakeholders to define the subscription types needed based on email programs and audience segments. End state: Approved list of subscription types with clear definitions.

- Catalog all current email types being sent (newsletters, product updates, events, sales outreach)
- Map email types to logical subscription categories (Marketing, Product, Transactional)
- Define granularity level (broad categories vs. specific topics)
- Document subscription type names and descriptions for preference center
- Get stakeholder approval on final subscription type list
- Determine default opt-in/opt-out status for each type

---

### Part 2: Configure Subscription Management Infrastructure

#### Step 1: Build Subscription Types in MAP

**Step Overview:** Create and configure subscription types within HubSpot or Marketo with proper settings and defaults. End state: All subscription types created with correct configuration.

- Create each subscription type in HubSpot/Marketo admin settings
- Configure default opt-in/opt-out status for new contacts per type
- Set up subscription type descriptions (visible in preference center)
- Define which types are required vs. optional
- Configure email associations (which emails map to which subscription type)
- Test subscription type behavior with sample contacts

#### Step 2: Build Preference Center

**Step Overview:** Create or customize the preference center where contacts manage their email subscriptions. End state: Functional preference center allowing self-service subscription management.

- Design preference center layout (subscription options, frequency settings)
- Configure preference center branding (logo, colors, copy)
- Implement subscription type checkboxes/toggles
- Add "Unsubscribe from All" option with appropriate warnings
- Include email frequency options if applicable (daily digest vs. immediate)
- Set up confirmation messaging for preference updates
- Test preference center across devices and browsers

#### Step 3: Configure Unsubscribe Handling

**Step Overview:** Set up compliant unsubscribe processes that honor requests immediately. End state: One-click unsubscribe working with proper confirmation and suppression.

- Enable one-click unsubscribe in email headers (required for compliance)
- Configure unsubscribe confirmation page messaging
- Set up suppression list automation for hard unsubscribes
- Define behavior for partial unsubscribes (one type vs. all)
- Test unsubscribe flow end-to-end
- Verify unsubscribe requests are honored within required timeframes

---

### Part 3: Implement Compliance Mechanisms

#### Step 1: Set Up Consent Tracking Fields

**Step Overview:** Create contact fields to track consent status, source, and timestamps for GDPR/CCPA compliance. End state: Consent data captured at field level with full audit trail.

- Create consent status field (Opted In, Opted Out, Not Set)
- Create consent date/timestamp field for each subscription type
- Create consent source field (form name, import, API, preference center)
- Create legal basis field for GDPR (consent, legitimate interest, contract)
- Set up field update automation when consent changes
- Document field mapping for data subject access requests

#### Step 2: Configure GDPR-Specific Requirements

**Step Overview:** Implement GDPR-specific consent mechanisms for EU contacts including double opt-in and explicit consent capture. End state: GDPR-compliant opt-in flows for EU audience.

- Configure double opt-in workflow for EU contacts
- Create confirmation email with explicit consent language
- Set up geographic-based consent rules (EU vs. non-EU treatment)
- Implement explicit consent checkboxes on forms (no pre-checked boxes)
- Configure consent withdrawal mechanisms
- Document lawful basis for each email type (consent vs. legitimate interest)

#### Step 3: Configure CCPA-Specific Requirements

**Step Overview:** Implement CCPA-specific requirements including "Do Not Sell" handling and response procedures. End state: CCPA-compliant processes for California residents.

- Create "Do Not Sell My Personal Information" tracking field
- Configure opt-out of sale mechanism if applicable
- Set up data subject request response workflow (10-day acknowledgment requirement)
- Document data categories collected for disclosure requests
- Configure contact deletion/anonymization workflow
- Create internal SOP for handling CCPA requests within required timeframes

---

### Part 4: Build Automation & Validation

#### Step 1: Create Subscription Management Automations

**Step Overview:** Build workflows to automate subscription status updates based on contact actions and form submissions. End state: Automated system that keeps subscription status accurate without manual intervention.

- Build form submission workflow to update subscription types based on selections
- Create import process rules for setting subscription status on list uploads
- Configure API integration rules for subscription updates from external systems
- Set up re-engagement workflow triggers based on subscription changes
- Build sunset automation for chronically unengaged contacts
- Create welcome workflow triggered by new subscription opt-ins

#### Step 2: Validate Subscription Filtering in Email Sends

**Step Overview:** Ensure all email sends properly filter contacts based on subscription type preferences. End state: Verified that emails only go to opted-in contacts.

- Audit existing email programs for subscription type filtering
- Update email send lists to respect subscription preferences
- Configure smart lists/segments that dynamically filter by subscription status
- Test email sends with various subscription status combinations
- Document email program to subscription type mapping
- Set up monitoring for subscription filter compliance in future sends

---

### Part 5: Rollout & Enablement

#### Step 1: Conduct Marketing Team Training

**Step Overview:** Train the marketing team on the new subscription management system, preference center, and compliance requirements. End state: Marketing team confident in using the system correctly.

- Schedule training session (45-60 minutes)
- Cover: subscription types, preference center, consent tracking, compliance requirements
- Demonstrate how to properly set up emails with subscription filtering
- Walk through data subject request handling process
- Create quick-reference guide for common scenarios
- Address questions and edge cases
- Send recording and documentation to team

#### Step 2: Hand Off to Client

**Step Overview:** Transfer ownership of the subscription management system with full documentation. End state: Client self-sufficient with admin access, SOPs, and compliance checklists.

- Deliver documentation package (subscription type definitions, field mappings, workflow documentation)
- Create compliance checklist for ongoing email operations
- Transfer admin access and explain configuration options
- Document process for adding new subscription types in the future
- Provide GDPR/CCPA request response SOP (with reminder: not legal advice)
- Schedule 30-day check-in to address questions
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Access to Marketing Automation Platform (HubSpot or Marketo) with admin rights
- CRM integration in place (Salesforce or HubSpot CRM)
- Existing email programs to audit and update
- Understanding of which geographic regions the client markets to

**What client must provide:**
- List of current email types/programs being sent
- Stakeholder availability for subscription type approval
- Legal/compliance team input on GDPR/CCPA requirements (if available)
- Brand assets for preference center (logo, colors)
- Decision on subscription type granularity (broad vs. specific categories)

## 5. Common Pitfalls

- **Over-complicated subscription types**: Creating too many subscription options confuses contacts and reduces preference center completion. → **Mitigation**: Start with 3-5 broad categories; add specificity only if needed.
- **Missing consent timestamps**: Failing to capture when and how consent was obtained makes GDPR compliance impossible to prove. → **Mitigation**: Always capture consent source, date, and method at field level.
- **Forgetting transactional emails**: Treating transactional emails (order confirmations, password resets) like marketing emails blocks critical communications. → **Mitigation**: Clearly separate transactional from marketing subscription types; transactional should not be unsubscribable.
- **Delayed unsubscribe processing**: Processing unsubscribes in batch rather than immediately violates CAN-SPAM and GDPR requirements. → **Mitigation**: Ensure unsubscribe requests are honored immediately (within hours, not days).

## 6. Success Metrics

- **Leading Indicator**: 100% of email programs have proper subscription type filtering configured within 2 weeks of launch.
- **Lagging Indicator**: Zero compliance violations or unsubscribe complaints reported within 90 days; preference center self-service rate above 80% (vs. direct unsubscribes).

---

