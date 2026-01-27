---
sidebar_position: 12
title: "Display Dynamic Lists"
---

# Display Dynamic Lists

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/qbUW4m9I5m4?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

#### Overview

#### Prerequisites

#### Steps

#### Example

#### Conclusion

Navigate to the **Setup **menu and select **Object Manager **.

Select the object that you want to add the dynamic related list to.

Click on the **Fields & Relationships **tab.

Under the **Related Lists **section, click **New **.

In the **Related List Type **field, select **Dynamic Related List **.

In the **Related List Name **field, enter a name for the related list.

In the **Parent Object **field, select the object that is related to the object you are adding the related list to.

In the **Related Object **field, select the object that you want to display records from.

In the **Related List Label **field, enter a label for the related list.

In the **Related List Type **field, select either **List **or **Tile **.

In the **Number of Records to Display **field, enter the number of records that you want to display in the related list.

In the **Related List Fields **section, select the fields that you want to display in the related list.

In the **Sort By **field, select the field that you want to sort the records by.

In the **Sort Order **field, select either **Ascending **or **Descending **.

In the **Filter Criteria **section, enter any filter criteria that you want to apply to the related list.

In the **Component Visibility **section, select the users or groups that you want to be able to see the related list.

In this example, we will add a dynamic related list to the Opportunity object that displays the most recent 10 PCs for the Opportunity's account.

Select the **Opportunity **object.

In the **Related List Name **field, enter **PCs **.

In the **Parent Object **field, select **Account **.

In the **Related Object **field, select **PC **.

In the **Related List Label **field, enter **PCs for Account **.

In the **Related List Type **field, select **List **.

In the **Number of Records to Display **field, enter **10 **.

In the **Related List Fields **section, select the following fields:

In the **Sort By **field, select **Start Date **.

In the **Sort Order **field, select **Descending **.

After saving the dynamic related list, you will be able to see the most recent 10 PCs for the Opportunity's account on the Opportunity page.
