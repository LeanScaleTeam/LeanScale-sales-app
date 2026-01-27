---
sidebar_position: 11
title: "Displaying Record Information"
---

# Displaying Record Information

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/0pkM5S5ucHg?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

### Overview

### Prerequisites

### Step-by-Step Instructions

### Example

### Considerations

### Troubleshooting

An understanding of how to create related records and update actions.

**Navigate to the record you want to add the related record to. **

**Click the Edit button. **

**In the Related Records section, click the New button. **

**Select the object you want to relate to the record. **

**Enter the necessary information for the related record. **

**Select the Update Action you want to use. **

**Click the Save button. **

**The related record will now be displayed on the record. **

In this example, we will add the account information to an opportunity record.

**Navigate to the opportunity record you want to add the account information to. **

**Select the Account object. **

**Enter the account name and other relevant information. **

**Select the Update Account action. **

**The account information will now be displayed on the opportunity record. **

The related record will only be displayed on the record if the user has permission to view the related object.

The update action will only be executed if the user has permission to edit the related object.

This method can be used to bring other objects and data into records, such as contacts, leads, and custom objects.

If the related record is not displayed on the record, check the following:

The user has permission to view the related object.

The related record has been saved.

The related record is not hidden by a page layout or field-level security.

If the update action is not executed, check the following:

The user has permission to edit the related object.

The update action is active.

The update action is not hidden by a page layout or field-level security.
