---
sidebar_position: 14
title: "Create Custom Buttons"
---

# Create Custom Buttons

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/xizQqr1NQFY?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

#### Overview

#### Prerequisites

#### Step-by-Step Guide

#### Additional Notes

A screen flow with three elements:

Record ID variable (text type, available for input)

Get Records element to store opportunity data

Screen element to allow users to input a new description

Update Records element to update the opportunity with the new description

**1. Create a Screen Flow **

Add the following elements to the flow:

**Record ID Variable **: Create a text variable named "recordId" (ensure the exact spelling matches). This variable will be used as a placeholder for the opportunity ID and must be available for input.

**Get Records Element **: Use this element to store all opportunity data. Set the object to "Opportunity," the ID field to "recordId" (the variable created in the previous step), and select "Get only the first record." You can choose to store all fields or just specific fields like the description.

**Screen Element **: This element allows users to input the new description. Use a text component, hide the header, and make the text field required. Set the default value to `{!opportunity.Description}` (replace "opportunity" with the API name of your opportunity object) to display the existing description as a placeholder.

**Update Records Element **: Use this element to update the opportunity. Select the opportunity object, filter by ID using "recordId," and update the description field with the value from the screen component (e.g., `{!Place_Update_Description}`).

**2. Create a Custom Action **

In the Opportunity object manager, click on "Buttons, Links, and Actions."

Click on "New Action."

Choose the "Opportunity Update Description" screen flow created in the previous step.

Enter a label (e.g., "Update Description") and click "Save."

Go back to the Opportunity page layout.

Click on "New Action" next to the existing buttons.

Select the "Update Description" action created in the previous step and click "Done."

Position the button as desired and click "Save."

**4. Test the Custom Button **

Refresh the Opportunity page.

The custom button should now be visible.

Click on the button to open the screen flow.

The existing description should be displayed as a placeholder.

Edit the description and click "Save."

The description of the opportunity should be updated accordingly.

The use cases for custom buttons are extensive, including creating new records, updating multiple fields, utilizing custom fields, and more.

Custom buttons can greatly enhance the user experience by providing quick and easy access to frequently performed actions.
