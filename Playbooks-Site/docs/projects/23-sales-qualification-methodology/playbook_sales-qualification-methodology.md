# Sales Qualification Methodology - Playbook

## 1. Definition

**What it is**: A strategic implementation project that selects, customizes, and deploys a structured qualification framework (MEDDIC, BANT, SPICED, etc.) to help sales representatives systematically evaluate and prioritize opportunities. The project includes CRM configuration, sales team training, and ongoing coaching infrastructure to ensure sustained methodology adoption.

**What it is NOT**: Not a sales process redesign (that covers the entire deal lifecycle). Not a CRM implementation or migration. Not conversation intelligence setup (call recording/analysis). Not sales enablement content creation (playbooks, battle cards).

## 2. ICP Value Proposition

**Pain it solves**: Sales teams waste time on unqualified opportunities because reps lack a consistent framework for evaluating deal viability. Pipeline forecasts are unreliable because qualification data is subjective or missing. Win rates are lower than industry benchmarks because reps pursue deals they cannot win.

**Outcome delivered**: A documented qualification methodology embedded in the CRM with structured fields that capture qualification criteria consistently. Sales team is trained and coached on the methodology. Win rates improve 15-30% as reps focus on winnable deals. Forecasting accuracy increases due to standardized qualification data.

**Who owns it**: VP of Sales or Sales Ops Leader, with RevOps providing CRM implementation support.

## 3. Implementation Procedure

### Part 1: Assess Current State and Define Requirements

#### Step 1: Audit Existing Qualification Practices

**Step Overview:** Evaluate how reps currently qualify opportunities and identify gaps in process, data, and outcomes. End state: Gap analysis document showing current qualification maturity and improvement areas.

- Interview 3-5 sales reps on their current qualification approach and pain points
- Review CRM opportunity records for last 90 days to assess qualification data completeness
- Analyze win/loss data to identify patterns (deals lost due to poor qualification)
- Document which qualification criteria are currently tracked vs. missing
- Quantify the problem (e.g., "Only 40% of opps have budget documented, win rate is 18%")

#### Step 2: Define Qualification Requirements and Select Methodology

**Step Overview:** Choose the qualification framework that best fits the sales motion and buyer complexity. End state: Selected methodology with stakeholder buy-in and rationale documented.

- Assess sales cycle complexity (deal size, stakeholder count, sales cycle length)
- Evaluate methodology options: BANT (simple, short cycles), MEDDIC/MEDDPICC (complex, enterprise), SPICED (outcome-focused)
- Map methodology fit to company stage and buyer journey complexity
- Present recommendation to VP Sales with pros/cons of each option
- Document selected methodology and customization requirements

---

### Part 2: Customize Framework and Configure CRM

#### Step 1: Customize Qualification Criteria for the Business

**Step Overview:** Adapt the selected methodology to the organization's specific sales motion, buyer personas, and deal characteristics. End state: Customized qualification framework document with company-specific definitions.

- Define each qualification criterion with company-specific language and examples
- Create scoring rubric or rating scale for each criterion (e.g., 1-5 scale with definitions)
- Identify mandatory vs. optional fields based on deal stage
- Map qualification milestones to sales stages (what must be qualified by Stage 2 vs. Stage 4)
- Get sign-off from sales leadership on customized framework

#### Step 2: Configure CRM Fields and Sections

**Step Overview:** Build the qualification methodology into the CRM with structured fields, picklists, and validation rules. End state: CRM opportunity object updated with qualification section and fields active.

- Create custom fields for each qualification criterion (picklists, text, checkboxes as appropriate)
- Build qualification section/panel on the Opportunity layout in logical order
- Configure field dependencies and validation rules (e.g., require Budget before Stage 3)
- Set up field-level help text with examples of what "good" looks like
- Test field configuration with sample opportunities across different stages

#### Step 3: Build Qualification Tracking and Reporting

**Step Overview:** Create reports and dashboards to monitor qualification data quality and methodology adoption. End state: Live dashboard showing qualification completion rates and quality metrics.

- Build report on qualification field completion rates by rep, team, and stage
- Create dashboard showing qualification data vs. win rate correlation
- Set up alerts for opportunities advancing without required qualification fields
- Configure manager views to support pipeline review and coaching conversations
- Document reporting package and train RevOps on maintenance

---

### Part 3: Develop Training Materials and Enable the Team

#### Step 1: Create Training Content and Job Aids

**Step Overview:** Develop training materials that teach the methodology and provide ongoing reference tools. End state: Complete training package including slides, job aids, and reference documentation.

- Create training deck covering methodology principles and company customizations
- Build one-pager/job aid with qualification questions mapped to each criterion
- Develop example scenarios showing good vs. poor qualification
- Create CRM reference guide showing where and how to enter qualification data
- Record short video walkthroughs of qualification questions and CRM entry

#### Step 2: Conduct Sales Team Training

**Step Overview:** Train the sales team on the new qualification methodology and CRM usage. End state: All reps trained and capable of applying the methodology.

- Schedule training sessions (60-90 min) for all sales reps and managers
- Cover: why this methodology, what each criterion means, how to ask qualifying questions
- Demonstrate CRM usage with live examples
- Conduct role-play exercises to practice qualification conversations
- Share training recording and materials with team for ongoing reference

#### Step 3: Train Sales Managers on Coaching the Methodology

**Step Overview:** Enable sales managers to reinforce methodology adoption through pipeline reviews and coaching. End state: Managers equipped with tools and cadence for qualification coaching.

- Train managers on using qualification data in pipeline reviews
- Provide coaching question framework tied to each qualification criterion
- Establish pipeline review cadence that includes qualification checkpoints
- Create manager dashboard for tracking team qualification compliance
- Document coaching playbook with example coaching conversations

---

### Part 4: Launch, Monitor, and Reinforce Adoption

#### Step 1: Roll Out Methodology with Pilot Group

**Step Overview:** Launch the methodology with a pilot group before full rollout to identify issues and refine approach. End state: Pilot complete with lessons learned documented.

- Select pilot group (1 team or 5-10 reps) for initial rollout
- Run pilot for 2-3 weeks with active monitoring and feedback collection
- Track field completion rates and data quality during pilot
- Gather rep feedback on questions, CRM usability, and challenges
- Refine training materials and CRM config based on pilot learnings

#### Step 2: Execute Full Rollout and Monitor Adoption

**Step Overview:** Deploy methodology to full sales organization with monitoring and support. End state: All reps actively using methodology with baseline adoption metrics established.

- Announce full launch with leadership support and communication
- Monitor qualification field completion rates daily for first 2 weeks
- Provide office hours or Slack support channel for questions
- Address common issues with targeted micro-training
- Publish weekly adoption metrics and celebrate early wins

#### Step 3: Establish Ongoing Coaching and Reinforcement

**Step Overview:** Set up sustainable coaching infrastructure to maintain long-term methodology adoption. End state: Recurring coaching cadence in place with accountability mechanisms.

- Integrate qualification review into weekly pipeline meetings
- Set up manager-rep 1:1 coaching structure around qualification quality
- Create monthly methodology reinforcement touchpoints (tips, examples, wins)
- Establish process for updating methodology based on lessons learned
- Schedule 30-day and 90-day adoption reviews with leadership

#### Step 4: Hand Off to Client and Document

**Step Overview:** Transfer ownership of the methodology and supporting systems to the client team. End state: Client self-sufficient with documentation and trained internal owners.

- Transfer admin access for CRM fields and reports to client RevOps
- Deliver documentation package (methodology guide, CRM config, training materials)
- Conduct knowledge transfer session with internal methodology owner
- Schedule 30-day check-in to assess adoption and answer questions
- Close out project with final adoption metrics report

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM admin access (Salesforce or HubSpot) with permissions to create custom fields
- Access to opportunity data for last 90 days (win/loss analysis)
- Sales leadership alignment on need for qualification methodology
- Budget/time commitment for sales team training (2-3 hours per rep)

**What client must provide:**
- Access to 3-5 reps for interviews during current state assessment
- Sales leadership availability for methodology selection decision
- Sales manager participation in coaching training
- Communication support to announce rollout to sales team

## 5. Common Pitfalls

- **CRM Fields Without Training**: Adding qualification fields without training reps on why and how to use them leads to empty or generic data (e.g., "Budget: TBD"). → **Mitigation**: Always pair CRM configuration with training and reinforce with coaching.

- **Methodology Too Complex for Sales Motion**: Implementing MEDDPICC for a transactional sales cycle with 1-2 decision makers creates unnecessary friction. → **Mitigation**: Match methodology complexity to deal complexity; BANT for simple, MEDDIC for enterprise.

- **No Coaching Infrastructure**: 73% of methodology implementations fail within 90 days because training isn't reinforced with ongoing coaching. → **Mitigation**: Build manager coaching into the rollout plan from day one.

- **Qualification as Checklist vs. Conversation**: Reps treat qualification fields as boxes to check rather than genuine discovery questions, resulting in low-quality data. → **Mitigation**: Train on qualification as conversation skill, not CRM data entry task.

## 6. Success Metrics

- **Leading Indicator**: Qualification field completion rate >80% within 30 days of rollout; managers conducting qualification reviews in 1:1s.
- **Lagging Indicator**: Win rate improvement of 10-15% within 90 days; forecast accuracy improvement; reduced sales cycle for qualified deals.

---

