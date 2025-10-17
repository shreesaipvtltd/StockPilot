# Inventory Management System - Design Guidelines

## Design Approach: Data-Focused Design System

**Selected System**: Material Design principles adapted for enterprise inventory management, emphasizing clarity, hierarchy, and efficient data interaction.

**Core Principle**: Prioritize information density and task efficiency while maintaining visual comfort for extended work sessions. This is a productivity tool where users spend hours daily - clarity trumps decoration.

## Color Palette

**Light Mode:**
- Primary: 217 91% 60% (Professional blue for actions, buttons, active states)
- Background: 0 0% 100% (Pure white for main surfaces)
- Surface: 220 14% 96% (Light gray for cards, elevated panels)
- Border: 220 13% 91% (Subtle borders for definition)
- Text Primary: 222 47% 11% (Near-black for readability)
- Text Secondary: 215 16% 47% (Medium gray for supporting text)
- Success: 142 71% 45% (Green for stock sufficient, approvals)
- Warning: 38 92% 50% (Amber for low stock alerts)
- Error: 0 84% 60% (Red for critical alerts, out of stock)

**Dark Mode:**
- Primary: 217 91% 70% (Lighter blue for dark backgrounds)
- Background: 222 47% 11% (Deep charcoal)
- Surface: 217 19% 18% (Elevated dark gray)
- Border: 217 19% 27% (Subtle borders)
- Text Primary: 210 20% 98% (Near-white)
- Text Secondary: 215 20% 65% (Light gray)

## Typography

**Font Stack**: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif (via Google Fonts CDN)

**Hierarchy**:
- Page Titles: 2xl font-bold (Dashboard, Reports, Stock Management)
- Section Headers: xl font-semibold (Widget titles, form sections)
- Card Titles: base font-medium (Product names, transaction items)
- Body Text: sm font-normal (Data entries, descriptions)
- Labels: xs font-medium uppercase tracking-wide (Form labels, status badges)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-4 to p-6
- Section margins: mt-6 to mt-8
- Card spacing: gap-4 to gap-6
- Form field spacing: space-y-4

**Dashboard Grid**: 12-column responsive grid
- Main content: col-span-12 lg:col-span-9 (dashboard, tables)
- Sidebar: col-span-12 lg:col-span-3 (filters, quick stats)

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo left, user profile/notifications right, height h-16
- **Sidebar**: Collapsible navigation (w-64 expanded, w-16 collapsed) with role-based menu items
- **Breadcrumbs**: Show current location path for deep navigation

### Dashboard Components
- **Stat Cards**: 4-column grid (grid-cols-1 md:grid-cols-2 xl:grid-cols-4) with icon, value, label, trend indicator
- **Alert Banner**: Full-width strips for low stock warnings with icon, message, action button
- **Activity Feed**: Chronological list with avatar, action description, timestamp, subtle separators
- **Charts**: Line charts for trends, bar charts for comparisons, donut charts for category breakdowns

### Data Display
- **Tables**: Striped rows, sticky headers, sortable columns, row hover states
- **Status Badges**: Pill-shaped with color coding (green=approved, amber=pending, red=rejected, blue=in-progress)
- **Filters Panel**: Collapsible sidebar with date pickers, category dropdowns, search fields
- **Pagination**: Bottom-aligned with page numbers, prev/next controls, items-per-page selector

### Forms & Inputs
- **Input Fields**: Floating labels, clear focus states (ring-2 ring-primary), error messages below field
- **Dropdowns**: Custom styled selects with chevron icon, max-height dropdown with scroll
- **Date Pickers**: Calendar overlay with range selection for reports
- **File Upload**: Drag-and-drop zone with preview thumbnails for invoice attachments

### Workflow Components
- **Request Cards**: Compact card showing requester, items, status, approval buttons for managers
- **Approval Modal**: Center overlay with request details, approve/reject buttons, comment field
- **Stock-In Form**: Multi-step wizard with progress indicator (steps: Product → Quantity → Supplier → Confirm)
- **Confirmation Dialog**: Center modal with icon, message, cancel/confirm actions

### Visual Alerts
- **Stock Level Indicators**: 
  - Green badge (≥reorder threshold)
  - Amber badge (10-20% below threshold)
  - Red badge + warning icon (critical low)
- **Toast Notifications**: Top-right corner, auto-dismiss, action buttons for undo/view
- **Inline Validation**: Real-time field validation with checkmark (valid) or error icon/message

## Role-Based UI Patterns

**Admin Dashboard**: Full metrics overview, user management cards, system health indicators
**Manager Dashboard**: Approval queue prominent, stock analytics, team performance widgets
**Warehouse Staff**: Quick stock-in form, pending tasks list, scanner integration ready
**Employee**: Simple request form, personal request history, status tracking

## Responsive Breakpoints

- Mobile (< 768px): Single column, bottom navigation, simplified tables (card view)
- Tablet (768px - 1024px): 2-column layout, collapsible sidebar
- Desktop (> 1024px): Full layout with expanded sidebar, multi-column dashboards

## Accessibility & Interactions

- **Keyboard Navigation**: Full tab order, escape to close modals, enter to submit forms
- **Screen Reader**: ARIA labels on all interactive elements, status announcements
- **Focus Management**: Clear focus rings (ring-2 ring-offset-2), logical tab flow
- **Loading States**: Skeleton screens for tables, spinner for button actions
- **Error Recovery**: Clear error messages with recovery actions, form field persistence

## Images

**No hero images** - This is a utility application focused on data and functionality. Visual assets limited to:
- **Icons**: Heroicons CDN for interface icons (outline style for navigation, solid for status indicators)
- **Product Thumbnails**: Small square previews (64x64px) in product lists/cards
- **Avatar Placeholders**: User initials on colored backgrounds for staff profiles
- **Empty States**: Simple illustrations (via undraw.co or similar) for "No products found", "No requests pending"
- **Chart Backgrounds**: Subtle gradients only within data visualization contexts