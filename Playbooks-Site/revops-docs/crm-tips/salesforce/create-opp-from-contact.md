---
title: "Create Opp from Contact"
sidebar_position: 2
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/bEmSvAXTV5w?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

# Create Opp from Contact

## Opportunity Creation Directly from Contact Record

### Overview

This guide explains how to establish a streamlined process for generating opportunities directly from contact records in Salesforce, improving workflow efficiency and ensuring proper attribution tracking.

### Benefits

Several advantages exist for this implementation approach:

- **Streamlined process**: Consistent methodology across all users minimizes errors and ensures uniformity
- **Accurate attribution**: Linking account, opportunity, and primary contact records populates attribution fields correctly, providing valuable lead source and campaign insights
- **Customization**: Additional fields can be pre-filled using contact record data, ensuring opportunities launch with necessary information

### Prerequisites

- Salesforce Administrator permissions
- JavaScript familiarity

### Instructions

#### 1. Create a Custom Button on the Contact Object

1. Navigate to the Contact object manager
2. Click "Buttons, Links, and Actions"
3. Select "New Button"
4. Configure these settings:
   - **Label**: New Opportunity
   - **Name**: New_Opportunity
   - **Display Type**: Detail Page Button
   - **Behavior**: Display in existing window with sidebar
   - **Content Source**: URL
   - **URL**: `/lightning/o/Opportunity/new?account={!Account.Id}&primary_contact_id={!Contact.Id}&stage_name={!Stage_Name}&probability={!Probability}&forecast_category={!Forecast_Category}&Name={!Name}&CloseDate={!CloseDate}`

5. Click Save

#### 2. Add the Custom Button to the Contact Page Layout

1. Access the Contact object manager
2. Click "Page Layouts"
3. Select "Edit" for the desired layout
4. Drag the "New Opportunity" button to your preferred location
5. Save changes

#### 3. Customize the Opportunity Creation Form (Optional)

Extend the URL by adding additional field names, API names, and values separated by commas to prepopulate more fields during opportunity creation.

### Usage

After implementation, users can click the "New Opportunity" button from any contact record. The system will auto-populate the opportunity with linked account, primary contact, stage name, probability, forecast category, name, and close date. Further customization enables additional field population through URL modification.
