---
title: "Close Date Change Counter"
sidebar_position: 5
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/ZaXhFG-5vPM?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

# Close Date Change Counter

## Overview

This guide explains how to create a custom field in Salesforce to track modifications to an opportunity's close date, along with an automated flow to update the counter.

## Prerequisites

- Salesforce Administrator permissions
- Access to the Opportunity object

## Creating the Custom Field

Follow these steps to set up the tracking field:

1. Navigate to **Setup** > **Objects** > **Opportunity**
2. Click **Fields & Relationships** tab
3. Select **New** button
4. Choose **Number** data type
5. Configure with these details:
   - **Field Label**: Number of Closed Date Changes
   - **API Name**: Number_of_Closed_Date_Changes
   - **Decimal Places**: 0
   - **Default Value**: 0
6. Click **Save**

## Creating the Record-Triggered Flow

Set up automation to increment the counter:

1. Go to **Setup** > **Process Automation** > **Flows**
2. Click **New Flow**
3. Select **Record-Triggered Flow** template
4. Enter flow details:
   - **Flow Name**: Update Number of Closed Date Changes
   - **API Name**: Update_Number_of_Closed_Date_Changes
   - **Object**: Opportunity
   - **Trigger**: Record is updated
5. Add a **Formula** element:
   - **Name**: Closed Date Changed
   - **Type**: Boolean
   - **Expression**: `{!Opportunity.CloseDate} != {!Opportunity.PriorCloseDate}`
6. Add an **Assignment** element:
   - **Variable**: Number of Closed Date Changes
   - **Value**: `{!IF(ISBLANK(Opportunity.Number_of_Closed_Date_Changes), 0, Opportunity.Number_of_Closed_Date_Changes) + 1}`
7. Save and Activate

## Adding to Page Layout

1. Navigate to **Setup** > **Objects** > **Opportunity**
2. Click **Page Layouts** tab
3. Select your desired layout
4. Drag the custom field onto the layout
5. Click **Save**

## Testing

1. Create or edit an opportunity
2. Modify the close date
3. Verify the counter increments automatically
