# SBCO Brick Field

## Current State
- Total Orders page has Edit (pencil) and Delete (trash) buttons per order, but no 'Mark as Pending' button to send order to Pending Delivery list
- Direct Delivery form has Customer Name, Address, Phone, Invoice fields but NO date field
- Daily Report uses completedDeliveries as data source (correct), but shows hardcoded static fallback data (Rahul/Soma/Sinu/Raju, DANGAPARA rows) when no real data exists — so deleting all completed deliveries still shows static data in report
- All report/list pages have both a 'Print' button and a 'Download PDF' button

## Requested Changes (Diff)

### Add
- Red 'Pending' button on each Total Orders card — clicking it moves the order to Pending Delivery list
- Date input field in Direct Delivery Basic Information section (defaulting to today)

### Modify
- Daily Report: remove static fallback data entirely. When no completed deliveries exist, show an empty state message instead of fake data
- Weekly Report: same — remove any static fallback data, show empty state when no data
- Completed Delivery delete: already removes from completedDeliveries state → this will correctly remove from Daily/Weekly reports since they read from that state. No additional changes needed here.
- Completed Delivery edit: same — edits to completedDeliveries state already reflect in reports
- Remove 'Download PDF' buttons from ALL pages (Pending Delivery, Completed Delivery, Daily Report, Weekly Report, Closed Orders, any other page). Keep only 'Print' button everywhere.

### Remove
- Static fallback data arrays (staticLabours, staticRows, staticVehicles) from DailyLabourReport component
- All 'Download PDF' / handleDownloadPDF buttons across all pages

## Implementation Plan
1. In Total Orders card, add a red button (with Truck or ChevronRight icon) labeled 'Pending' beside edit/delete buttons. Clicking it calls onMarkPending(order) which moves the order to pendingDeliveries list.
2. In DirectDeliveryPage form, add a date input (type=date, default today) in the Basic Information 2-column grid. Pass the date to the saved order's orderDate and approxDeliveryDate.
3. In DailyLabourReport: remove staticLabours, staticRows, staticVehicles variables. Replace the `!hasRealData` branch with a simple empty state UI ("কোনো ডেলিভারি নেই" message).
4. In WeeklyLabourReport: same — remove any static fallback data if present.
5. Search entire App.tsx for all PDF download buttons (data-ocid containing 'pdf') and remove them along with their handler functions (handleDownloadPDF1, handleDownloadPDF2, handleDownloadPDF3, handleDownloadPDF4).
6. Validate and build.
