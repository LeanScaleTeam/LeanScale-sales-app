---
sidebar_position: 18
title: "Bypass Validation Rules"
---

# Bypass Validation Rules

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/kXz4OoSaGns?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

### Bypass Validation Rules with Permission Sets

#### Overview

#### Prerequisites

#### Steps

#### Example

#### Testing

#### Conclusion

You must have the "Manage Permission Sets" permission.

You must have the "Edit" permission on the object that you want to bypass the validation rule for.

Create a new permission set.

Add the "Bypass Validation Rules" custom permission to the permission set.

Assign the permission set to the users who need to bypass the validation rule.

Edit the validation rule and add the following formula to the "Error Condition Formula" field:

This formula will evaluate to true if the user does not have the "Bypass Validation Rules" permission set assigned to them. In this case, the validation rule will be triggered and the user will not be able to save the record.

In the example below, we will create a permission set that allows users to bypass the validation rule on the Opportunity object that prevents users from saving an opportunity without an implementation fee.

**Create a new permission set. **

Select **Users **> **Permission Sets **.

Click on the **New **button.

Enter a name for the permission set, such as "Bypass Validation Rules V2".

Click on the **Save **button.

**Add the "Bypass Validation Rules" custom permission to the permission set. **

Click on the **Custom Permissions **tab.

Select the "Bypass Validation Rules V2" permission.

Click on the **Add **button.

**Assign the permission set to the users who need to bypass the validation rule. **

Click on the **Users **tab.

Select the users who need to bypass the validation rule.

Click on the **Assign Permission Set **button.

Select the "Bypass Validation Rules V2" permission set.

Click on the **Assign **button.

**Edit the validation rule and add the following formula to the "Error Condition Formula" field: **

Select **Objects **> **Opportunity **.

Click on the **Fields & Relationships **tab.

Select the "Implementation Fee" field.

Click on the **Validation Rules **tab.

Enter a name for the validation rule, such as "Implementation Fee Required".

Select the "Error Condition Formula" field.

Enter the following formula:

To test the validation rule, create a new opportunity and try to save it without entering an implementation fee. You should see an error message that prevents you from saving the opportunity.

Now, assign the "Bypass Validation Rules V2" permission set to the user who is trying to save the opportunity. Try to save the opportunity again. This time, you should be able to save the opportunity without entering an implementation fee.
