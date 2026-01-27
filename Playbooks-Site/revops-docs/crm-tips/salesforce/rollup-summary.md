---
title: "Roll Up Summary Field"
sidebar_position: 4
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/qVzXNbegAVY?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

# Roll Up Summary Field

## Declarative Lookup Rollup Summaries (DLRS)

### Overview

DLRS is a tool designed to overcome limitations of Salesforce's native rollup summary fields. It enables:

- Rolling up child objects into parent objects
- Using filters to specify which child records to include in rollups
- Aggregating data from multiple fields into a single rollup field

### Installation

To install DLRS:

1. Navigate to the Salesforce AppExchange
2. Search for "Declarative Lookup Rollup Summaries"
3. Click the "Install" button
4. Follow on-screen instructions to complete installation

### Configuration

After installing DLRS, configure it by:

1. Access Salesforce Setup > Objects and Fields
2. Find the child object and click the "Rollup Summaries" tab
3. Click "New"
4. Enter a name and API name for the rollup summary
5. Select the parent object in "Lookup Relationship"
6. Choose the relationship field linking child to parent
7. Add criteria to filter child records as needed
8. In "Rollup Details," select the field to roll up and aggregation function
9. Enter the API name for storing rollup data
10. Set "Calculation Mode" to "Scheduled"
11. Set "Sharing Mode" to "System"
12. Save your configuration

### Usage

To use DLRS:

1. Navigate to the parent object
2. Click the "Rollup Summaries" tab
3. Select "Run Calculation"
4. Choose the desired rollup summary
5. Click "Run"

Data will aggregate from child objects into the specified parent field.

### Scheduling

To enable automatic runs:

1. Go to Setup > Objects and Fields
2. Find the child object's "Rollup Summaries" tab
3. Click "Manage Child Trigger" then "Install"
4. Once Apex triggers are installed, click "Schedule"
5. Select the rollup summary and desired schedule
6. Save

DLRS will execute automatically per your specified schedule.

### Troubleshooting

Verify the following if experiencing issues:

- Apex triggers have been installed
- Rollup summary configuration is correct
- Child records match relationship criteria
- Correct field is selected in "Rollup Details"
- Proper aggregation function is selected
- Field API name is entered correctly in "Rollup Details"

Contact Salesforce support if problems persist.
