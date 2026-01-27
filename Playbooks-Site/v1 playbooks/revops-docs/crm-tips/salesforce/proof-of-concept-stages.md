---
sidebar_position: 10
title: "Proof of Concept Stages"
---

# Proof of Concept Stages

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/Jdkb8fsBAhA?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

### POC Object

### Automation

### Custom Button

### Conclusion

POC **with Account Record: **This field links the POC to an account record.

**Opportunity Record: **This field links the POC to an opportunity record.

**POC Name: **This field specifies the name of the POC.

**POC Stage: **This field indicates the current stage of the POC.

**POC Comments: **This field allows users to add comments or notes about the POC.

**POC Start Date: **This field specifies the start date of the POC.

**POC End Date: **This field specifies the end date of the POC.

**POC Result: **This field indicates the outcome of the POC (e.g., "success" or "failure").

**POC Stage Timestamps: **These fields capture the timestamps for each stage of the POC.

To ensure that all the POC stage timestamps are recorded accurately, even if users skip stages, a record trigger flow is created. This flow triggers whenever a record is created or updated in the POC object. The entry condition for the flow is when the POC stage of the record is different from the POC stage of the prior record.

The flow then uses assignment elements to update all the POC stage timestamps at the same time. Each assignment element uses a formula to determine whether to update the timestamp based on the current PC stage and the value of the corresponding timestamp field.

To make it easier for users to create a POC from the opportunity object, a custom button is created. This button is an action that creates a new record in the POC object. The button is configured to be visible only if the opportunity stage is not equal to "SQL" or "Discovery Demo Completed".

When the button is clicked, it opens a form that allows the user to enter the required information for the POC, including the account record, POC name, POC stage, start date, and end date. The button also includes a success message that is displayed after the POC record is created.

The POC records are also added to the opportunity page layout so that users can easily see all the POC that are running for a particular account. The POC records are displayed in a box on the opportunity page, and each record shows the POC name, POC stage, and POC start and end dates.
