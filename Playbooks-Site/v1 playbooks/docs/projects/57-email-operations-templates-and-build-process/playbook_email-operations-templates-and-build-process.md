# Email Operations: Templates & Build Process - Playbook

## 1. Definition

**What it is**: A marketing operations project that establishes a library of standardized, reusable email templates and defines a repeatable build process for creating, customizing, and deploying email campaigns within HubSpot or Marketo. The deliverable is a working template system with documented workflows that enables the marketing team to produce on-brand emails faster.

**What it is NOT**: Not a full Marketing Automation Platform implementation (that's a separate project). Not email nurture program strategy or campaign content creation. Not email deliverability optimization or compliance framework setup.

## 2. ICP Value Proposition

**Pain it solves**: Marketing teams waste hours recreating emails from scratch for each campaign because no standardized templates exist. Emails are inconsistent in branding, hard to test across devices, and the build process varies person-to-person. This slows campaign velocity and introduces quality issues.

**Outcome delivered**: A library of 5-10 modular, responsive email templates covering key use cases (promotional, transactional, newsletter, event) plus a documented build process that reduces email production time by 50%+ while ensuring brand consistency and mobile responsiveness.

**Who owns it**: Marketing Operations Manager or Demand Generation Lead.

## 3. Implementation Procedure

### Part 1: Discovery & Requirements Gathering

#### Step 1: Audit Current Email Operations

**Step Overview:** Assess the current state of email templates and build processes to identify gaps and establish a baseline. End state: Documented inventory of existing templates and clear understanding of current pain points.

- Pull list of all email templates currently in the MAP (HubSpot/Marketo)
- Review 10-15 recent emails sent to assess design consistency and quality
- Interview 2-3 marketing team members on current email build workflow
- Document time spent per email build (average hours from request to send)
- Identify which email types are missing templates (promotional, transactional, newsletter, event)
- Note any mobile responsiveness or rendering issues in current emails

#### Step 2: Define Template Requirements and Use Cases

**Step Overview:** Work with stakeholders to define the template types needed and specific requirements for each. End state: Approved template requirements document with use cases, design specs, and personalization needs.

- Meet with marketing leadership to prioritize email use cases (welcome, promotional, newsletter, event invite, transactional)
- Document required personalization tokens for each template type
- Gather brand guidelines (colors, fonts, logo usage, CTA button styles)
- Define content block requirements (header, hero image, body text, CTA, footer)
- Identify accessibility requirements (alt text, color contrast, font size minimums)
- Get stakeholder sign-off on template scope (number and types of templates)

#### Step 3: Map Email Build Process Current State

**Step Overview:** Document the existing email build workflow to identify bottlenecks and improvement opportunities. End state: Process map showing current workflow with pain points highlighted.

- Map current workflow from email request to deployment
- Identify handoff points between team members (copywriter, designer, ops)
- Document approval process and typical review cycles
- Note where delays or errors commonly occur
- Assess current QA/testing process for emails
- Calculate average lead time from request to send

---

### Part 2: Template Design & Development

#### Step 1: Design Template Architecture

**Step Overview:** Create the modular architecture that will enable templates to be flexible yet consistent. End state: Approved design system with reusable content blocks and layout variations.

- Define modular content block library (header, hero, 1-column, 2-column, CTA, footer, social)
- Create 2-3 layout variations for each major email type
- Design responsive breakpoints for mobile, tablet, and desktop
- Establish consistent spacing, padding, and margin standards
- Build color and typography style guide specific to email
- Get design approval from marketing/brand team before development

#### Step 2: Build Core Email Templates in MAP

**Step Overview:** Develop the approved templates within HubSpot or Marketo using the modular design system. End state: 5-10 functional email templates in the MAP ready for testing.

- Set up template folder structure in MAP for organization
- Build master template with all modular blocks as starting point
- Create promotional email template (sale, discount, product launch)
- Create newsletter/roundup email template with multi-section layout
- Create event invitation template with RSVP/registration CTA
- Create transactional email templates (confirmation, receipt, notification)
- Build welcome email template for new subscriber/customer onboarding
- Add personalization tokens and dynamic content placeholders
- Configure pre-header text and subject line variable fields

#### Step 3: Implement Dynamic Content and Personalization

**Step Overview:** Add advanced personalization capabilities to templates for segmented messaging. End state: Templates support dynamic content swapping based on contact properties.

- Set up dynamic content modules for industry-specific messaging
- Configure smart content rules based on lifecycle stage
- Add conditional logic for different product lines or regions
- Test personalization token fallback values
- Document which fields drive dynamic content decisions
- Verify personalization renders correctly across email clients

---

### Part 3: Testing & Quality Assurance

#### Step 1: Conduct Cross-Client Rendering Tests

**Step Overview:** Test all templates across major email clients and devices to ensure consistent rendering. End state: Templates render correctly on 95%+ of target email clients.

- Run templates through email testing tool (Litmus, Email on Acid, or MAP preview)
- Test on Gmail, Outlook (desktop and web), Apple Mail, Yahoo, mobile clients
- Verify responsive design adapts correctly on iOS and Android
- Check dark mode rendering and compatibility
- Document and fix any rendering issues discovered
- Create screenshot library showing expected rendering per client

#### Step 2: Validate Accessibility and Compliance

**Step Overview:** Ensure templates meet accessibility standards and email compliance requirements. End state: Templates pass accessibility audit and include required compliance elements.

- Verify all images have descriptive alt text
- Check color contrast ratios meet WCAG AA standards
- Confirm font sizes are readable (minimum 14px body, 22px headers)
- Validate unsubscribe link is present and functional
- Add physical mailing address to footer per CAN-SPAM
- Test screen reader compatibility for key content
- Document accessibility compliance for audit purposes

#### Step 3: Perform End-to-End Build Process Test

**Step Overview:** Run a complete email build using new templates and process to validate workflow. End state: Confirmed that a marketing team member can build a production-ready email using the new system.

- Have a marketing team member (not the builder) attempt to create an email
- Time the end-to-end build process from start to finish
- Document any confusion or friction points encountered
- Verify QA checklist catches common errors
- Test approval workflow functions correctly
- Confirm email deploys successfully to test segment

---

### Part 4: Documentation, Training & Handoff

#### Step 1: Create Template Documentation and Style Guide

**Step Overview:** Document all templates, their intended use cases, and customization guidelines. End state: Comprehensive template guide that enables self-service email creation.

- Write template overview document describing each template and use case
- Create customization guide (what can/cannot be changed)
- Document personalization options and how to use them
- Build content block reference with examples
- Include image specifications (dimensions, file size, format)
- Add copywriting guidelines for CTAs, subject lines, and body text

#### Step 2: Develop Email Build Process Runbook

**Step Overview:** Document the standardized email build process with step-by-step instructions. End state: Runbook that any team member can follow to produce consistent, quality emails.

- Create step-by-step email build checklist
- Document the request intake process (form, ticket, or brief template)
- Define roles and responsibilities (who does what)
- Establish review and approval workflow with SLAs
- Build QA checklist for pre-send verification
- Include troubleshooting guide for common issues

#### Step 3: Conduct Team Training Session

**Step Overview:** Train the marketing team on using templates and following the new build process. End state: Team is enabled to build emails independently using the new system.

- Schedule 45-60 minute training session with marketing team
- Walk through template library and when to use each template
- Demonstrate email build process step-by-step
- Cover customization best practices and common mistakes to avoid
- Practice building an email together (hands-on exercise)
- Record training session for future reference
- Distribute documentation package to all attendees

#### Step 4: Execute Handoff and Close Project

**Step Overview:** Transfer ownership to client team and establish ongoing support plan. End state: Client team is self-sufficient with templates and process.

- Transfer template ownership/access to client marketing ops
- Deliver all documentation (template guide, runbook, training recording)
- Schedule 30-day check-in to address questions
- Provide recommendations for template iteration and expansion
- Document metrics baseline for measuring improvement
- Close out project and gather feedback

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active Marketing Automation Platform (HubSpot or Marketo) with email capability
- Established brand guidelines (logo, colors, fonts)
- Access to MAP with admin or template creation permissions
- At least one marketing team member available for requirements gathering

**What client must provide:**
- Brand assets (logos, fonts, color codes)
- Examples of existing emails (good and bad)
- List of email types/use cases to prioritize
- Stakeholder availability for design reviews and approvals
- Access to email testing tool (or budget to acquire)

## 5. Common Pitfalls

- **Pitfall 1**: Building overly complex templates with too many variations upfront. -> **Mitigation**: Start with 5-7 core templates covering 80% of use cases. Iterate and add complexity later based on actual usage.

- **Pitfall 2**: Skipping cross-client testing and discovering rendering issues post-launch. -> **Mitigation**: Build testing into the process from the start. Test in Litmus or Email on Acid before any template is marked "complete."

- **Pitfall 3**: Creating templates that only one person knows how to use. -> **Mitigation**: Document everything and train multiple team members. Templates are only valuable if the team adopts them.

- **Pitfall 4**: Not establishing governance for template updates and versioning. -> **Mitigation**: Define who can edit master templates and create a change log. Prevent template drift with clear ownership.

## 6. Success Metrics

- **Leading Indicator**: Email build time reduction (target: 50%+ decrease in hours from request to send-ready)
- **Lagging Indicator**: Increased email campaign velocity (more campaigns launched per month) and improved email engagement metrics (open rate, click rate) due to consistent, optimized design

---

