---
sidebar_position: 15
title: "Tips for Data Loader"
---

# Tips for Data Loader

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    src="https://www.youtube.com/embed/ZhVfuucFPmc?rel=0"
    frameBorder="0"
    allowFullScreen
  />
</div>

## Data Loader Tips and Tricks

### Tip 1: Use Bulk API

### Tip 2: Use Multiple Data Loaders Simultaneously

### Tip 3: Adjust Batch Size

### Tip 4: Adjust Time Zone

### Tip 5: Update Fields with New Values

If you have more than 10,000 records to load, it is recommended to use Bulk API for better efficiency. To enable Bulk API, go to **Settings **in Data Loader, scroll down, and select **Use Bulk API **. You can also choose to enable serial mode, which ensures that Bulk API operations are processed one after another instead of in parallel.

You can use multiple Data Loaders simultaneously to upload multiple files at the same time. Each Data Loader can be configured independently, so you can use Bulk API in one and the regular API in another.

To update fields with new values that are not standard in Data Loader, you need to enable the **Insert new values **checkbox in **Settings **. Note that this option is only available when using the regular API, not Bulk API.
