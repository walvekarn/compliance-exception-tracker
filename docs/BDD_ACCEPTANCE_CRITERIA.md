# BDD Acceptance Criteria: Compliance Exception Tracker

## Exception creation

### Create exception — valid
- **Given** I am on the New Exception page  
- **When** I fill Vendor, Exception title, Type, Severity, Assigned To, Manager, Status (Open), Date Created (today), and optionally Description  
- **And** I submit the form  
- **Then** the exception is created  
- **And** I am redirected to the exception detail or list  
- **And** the new exception appears in the list with correct open days  

### Create exception — invalid (missing required)
- **Given** I am on the New Exception page  
- **When** I leave Vendor empty and submit  
- **Then** I see a validation error for Vendor  
- **And** the exception is not created  

### Create exception — invalid (future date)
- **Given** I am on the New Exception page  
- **When** I set Date Created to a future date and submit  
- **Then** I see a validation error for Date Created  
- **And** the exception is not created  

---

## Exception update and status transition

### Update exception — allowed status transition
- **Given** an exception exists with status "Open"  
- **When** I open the Edit form and change status to "In Progress" and save  
- **Then** the exception is updated  
- **And** the audit log shows the status change (old → new)  
- **And** the action log shows a "status_change" entry  

### Update exception — invalid status transition
- **Given** an exception exists with status "Open"  
- **When** I try to change status to "Closed" (not allowed from Open) and save  
- **Then** I see an error that the status transition is invalid  
- **And** the exception status remains "Open"  

### Reopen (Resolved/Closed → Open)
- **Given** an exception exists with status "Resolved" or "Closed"  
- **When** I change status to "Open" and save  
- **Then** the exception is updated to "Open"  
- **And** the action log records the status change  

---

## Vendor filter and list

### Filter by vendor
- **Given** I am on the Exceptions list  
- **When** I select a vendor in the Vendor filter  
- **Then** only exceptions for that vendor are shown  
- **And** the list is sorted by open days (descending by default)  

### Vendor summary
- **Given** I am on the By Vendor page  
- **When** I view the summary cards  
- **Then** each vendor shows open count and total count  
- **And** clicking a vendor takes me to the list filtered by that vendor  

---

## Open days

### Open days display
- **Given** an exception was created 10 days ago and is still Open  
- **When** I view the list or detail  
- **Then** Open Days is 10  

### Open days for resolved exception
- **Given** an exception was created on 2024-01-01 and resolved on 2024-01-15  
- **When** I view the detail  
- **Then** Open Days is 14  

---

## Audit log and action log

### Audit log after update
- **Given** an exception exists  
- **When** I update the exception (e.g. change Severity and Assigned To) and save  
- **Then** the exception detail shows an audit log entry  
- **And** the entry lists each changed field with old and new values  
- **And** the entry has a timestamp (UTC)  

### Action log on reassignment
- **Given** I am editing an exception  
- **When** I change Assigned To and optionally enter a reassignment reason, then save  
- **Then** the action log shows a "reassigned" entry  
- **And** the optional reason appears in the message  

---

## Export

### Export CSV
- **Given** I am on the Exceptions list with some filters applied  
- **When** I click Export CSV  
- **Then** a CSV file is downloaded  
- **And** the CSV contains only the exceptions matching the current filters  
- **And** the CSV includes columns: Vendor, Exception, Type, Severity, Assigned To, Manager, Status, Open Days, Date Created, Description  
