---
sidebar_position: 8
title: "Next Step Fields"
---

# Next Step Fields

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/VlDRvdd3Vig?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

### Next Steps Historical Field

#### Usage

**Next Steps Historical **: Long text area field with a maximum length of 131,072 characters. Stores historical comments added to the Next Steps field.

**Next Steps Last Updated **: Datetime field that stores the date and time when the Next Steps field was last updated.

**Line Break **: Custom label with a value of two dashes separated by a return. Used to create line breaks in formulas.

**Record Triggered Flow **: Triggered when an opportunity is created or updated.

**Entry Condition **: Triggers when the Next Steps field is changed.

**Assignment Elements **:

**Next Steps Historical **: Updates the Next Steps Historical field with a formula that includes the date, user who made the change, stage of the opportunity, and the text added to the Next Steps field.

**Next Steps Last Updated **: Updates the Next Steps Last Updated field with the current date and time.

**Formula for Next Steps Historical Field **

The formula for the Next Steps Historical field is as follows:

This formula includes the following elements:

Today's date in text format

First name of the user who made the change

Last name of the user who made the change

Stage name of the opportunity

Text added to the Next Steps field

Line Break custom label to create line breaks

Next Steps Historical field value

The formula uses the SUBSTITUTE function to replace the two dashes in the Line Break custom label with an empty value, which creates a line break in the formula.

To use the Next Steps Historical field, simply add comments to the Next Steps field on an opportunity. The comments will be automatically added to the Next Steps Historical field, along with the date, user who made the change, and stage of the opportunity.

You can also use the Next Steps Historical field to create reports and dashboards to track historical changes to the Next Steps field.
