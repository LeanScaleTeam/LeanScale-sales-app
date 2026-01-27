---
sidebar_position: 5
title: "Lead Stages"
---

# Lead Stages

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/CksLJCV8EV4?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

### Overview

### Prerequisites

### Custom Fields

### Automation Flows

### Reporting

### Conclusion

#### Opportunity Update Automation Flow

Before proceeding with the automation setup, ensure that you have the following in place:

A clear understanding of your lead lifecycle stages and scoring criteria.

The following custom fields are recommended for effective lead lifecycle automation:

**Primary Contact: **A lookup field to identify the primary contact associated with the lead. This field is optional but highly recommended for ease of reference and reporting.

This flow is triggered whenever a lead record is created, updated, or converted. It updates the lead lifecycle stage and timestamps based on the following conditions:

**S: **If the status is changed to "Meeting Scheduled" or the lead is converted, the "S Date/Time" field is updated with the current timestamp.

**SQL: **If the lead record is converted and the "SQL Date/Time" field is empty, it is updated with the current timestamp.

This flow is triggered when a lead is converted into an opportunity. It populates the opportunity with the following information from the converted lead record:

**Primary Contact **(if not already set in the opportunity)
