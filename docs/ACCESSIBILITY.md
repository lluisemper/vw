# Accessibility Documentation

## Tools Used

- **Axe DevTools**: Used during development to catch accessibility issues early.
- **Lighthouse**: Used in Chrome DevTools to audit accessibility.

## Components Implementation

### Modals

Implemented with `react-modal` which provides accessibility out of the box:

- Focus trapping
- Screen reader support
- Proper ARIA roles

### Table Headers

- Buttons placed inside `<th>` for sortable columns to make them keyboard-navigable
- Added `aria-sort` to indicate sorting state
- Buttons include `aria-label` describing the action (e.g., "Sort by Name ascending")

### Table Rows

- Action buttons (Edit, Delete, etc.) include `aria-label` for screen readers
- Icons inside buttons are decorative only and marked `aria-hidden="true"`

### Search Input

- Hidden `<label>` using `sr-only` ensures screen readers can describe the input
- Decorative search icon marked `aria-hidden="true"`

### Paginator

- Wrapped in a `<nav>` landmark with `aria-label="Pagination"`
- Buttons have discernible text for all breakpoints:
  - **Mobile**: hidden text replaced with `sr-only` labels
  - **Desktop**: visible text next to icons
- Icons inside buttons are hidden from screen readers with `aria-hidden="true"`

### Icon Buttons

- All icons inside buttons are `aria-hidden="true"`
- Buttons themselves have accessible names via visible text, sr-only text, or `aria-label`

## Compliance Summary

- All interactive elements are keyboard-navigable
- ARIA attributes are correctly used (`aria-sort`, `aria-label`)
- Landmarks (`<nav>` for paginator, `<main>` for content) aid screen reader navigation
- Decorative icons are hidden from assistive tech
- Tested with Axe DevTools to ensure high accessibility compliance
