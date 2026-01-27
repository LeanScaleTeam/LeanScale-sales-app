---
title: "Validation Rules in Flow"
sidebar_position: 3
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/Zpw9hVevsWU?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

# Validation Rules in Flow

## Overview

This guide demonstrates how to create validation rules in Salesforce using the Flow Builder, a newer approach that complements traditional validation rules.

## Prerequisites

- Salesforce org with Flow Builder permission enabled
- Opportunity object with "Terms in Months" and "Stage Name" fields

## Step-by-Step Implementation

### 1. Create a Record-Triggered Flow

- Open Flow Builder and select the "Record-Triggered Flow" template
- Configure these properties:
  - **Flow Name:** Validation Rule Test
  - **API Name:** Validation_Rule_Test
  - **Trigger:** Record is updated or created
  - **Object:** Opportunity

### 2. Set Entry Conditions

Keep entry conditions broad initially for flexibility during setup.

### 3. Define Validation Logic

Create a validation rule that checks:
- **Trigger condition:** Stage Name changes
- **Error condition:** Terms in Months field is empty AND Stage Name equals "Use Case Defined"

### 4. Add Custom Error Element

- **Label:** Custom Error Message
- **Display Type:** In a window
- **Message:** "Please add Terms in Months to move into the Use Case Defined stage."

### 5. Activate

Save and activate your flow to enable validation.

## Key Benefits

**Execute Priority:** Validation rules in a flow can be executed first before every other flow, which prevents users from seeing confusing error messages.

**Centralized Management:** Aggregate multiple validation rules into one flow for easier maintenance and reduced complexity.

## Conclusion

Flow-based validation rules provide enhanced control over data quality and user experience in Salesforce implementations.
