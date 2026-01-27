---
sidebar_position: 9
title: "Lead Source Taxonomy"
---

# Lead Source Taxonomy

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/WkKu8RXAoCs?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

#### Introduction

#### Objects and Fields

#### Field Dependencies

#### Validation Rules

#### Conclusion

Each of these objects has a "Lead Source" field, which stores the source of the lead. Additionally, each object has a "Lead Source Detail" field, which provides more information about the lead source.

Field dependencies are used to control the values that can be selected in a picklist field based on the value of another picklist field. For example, if the "Lead Source" field is set to "Demand", the "Lead Source Detail" field can only be set to certain values, such as "Email Marketing", "Blog Gated Content", "Podcast", or "Webinar".

To create a field dependency, navigate to the object that you want to add the dependency to and click on the "Fields" tab. Then, click on the "New" button and select "Field Dependency". In the "Field Dependency" dialog box, select the "Lead Source" field as the controlling field and the "Lead Source Detail" field as the dependent field.

To create a validation rule, navigate to the object that you want to add the validation rule to and click on the "Validation Rules" tab. Then, click on the "New" button and enter a name and description for the validation rule. In the "Formula" field, enter the formula that you want to use to validate the data. For example, the following formula would require the "Lead Source" field to be populated before an opportunity can be closed:
