# SBCO Brick Field

## Current State
The Daily Labour Report groups all deliveries by vehicle number in one combined table, mixing multiple dates. Phone numbers in Total Orders are displayed as plain text spans. Date handling uses `createdAt` or `orderDate` inconsistently.

## Requested Changes (Diff)

### Add
- Date-wise grouping in Daily Report: build a `dateVehicleMap` keyed by `date + vehicle`, each producing a separate card
- Card header showing `VEHICLE: XXXX | DATE: DD/MM/YYYY`
- Per-card total amount at card bottom
- Clickable phone numbers in TotalOrdersPage using `<a href="tel:...">` links
- Date picker in Add Order, Add Pending, Direct Delivery, and Complete Delivery forms (already present but needs to save correctly)

### Modify
- DailyLabourReportPage: replace vehicle-grouped sections with date+vehicle grouped cards
- Each card table: columns = Address | Bricks | Rate | Amount (remove Date column, remove Labour columns from main table)
- Amount per row = (bricks/1000) * rate
- Cards sorted descending by date (latest first)
- Phone number display in TotalOrdersPage: wrap in `<a href="tel:${order.phoneNumber}">` with Phone icon, styled green
- Filtering by date range uses `cd.deliveryDate || order.orderDate` (the saved date, not createdAt)

### Remove
- Date column from inside the report table
- Combined vehicle table that mixes multiple dates

## Implementation Plan
1. In `DailyLabourReportPage`: rebuild data grouping — group by `date` first, then `vehicleNumber` within date. Sort dates descending. Each (date, vehicle) pair = one card.
2. Card header: `VEHICLE: {vn} | DATE: {formatted date}`
3. Card table: Address | Bricks | Rate | Amount columns only. Amount = `(totalBricks/1000) * rate`.
4. Card footer: Total Amount for that card.
5. In `TotalOrdersPage`: make phone number an `<a href="tel:...">` anchor.
6. Print styles: update to match new card-per-date layout.
