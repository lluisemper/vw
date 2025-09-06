### NAME AND SURNAME: LLUIS SEMPER LLORET

# Project Overview

The backend is just a tiny json server for testing purposes/mocked API.

The frontend is a React + TypeScript demo application that consumes a mocked API to display, create, update, and delete items in a data table. The application features:

- DataTable with sorting, searching, and pagination
- CRUD operations with modals for adding and editing items
- State management using Zustand
- UI styling with Tailwind CSS
- Accessible modals using React Modal
- Responsive design suitable for desktop and mobile devices

The purpose of this project is to demonstrate React frontend skills, state management, component design, and asynchronous data handling in a small, maintainable application.

#### TESTING NOTE

For testing styles I would prefer to use e2e testing or visual regression testing. That way representing a more real scenario, you want to see on the real world how it looks. Checking for classes on unit testing I do not think it is meaningful in most cases.

#### Optimization

Lazy load of the modal, only loaded when needed.

<!-- TODO: project’s deployment, configuration and execution steps. -->

#### Modal

- Accessible
- Wider lock body scroll support, react-modal was throwing an error that could not do it in

#### Accessibility Documentation

Tools:

- Used Axe DevTools during development to catch accessibility issues early.

Modals:

- Implemented with `react-modal` which provides accessibility out of the box:
  - Focus trapping
  - Screen reader support
  - Proper ARIA roles

Table Headers:

- Buttons placed inside <th> for sortable columns to make them keyboard-navigable.
- Added `aria-sort` to indicate sorting state.
- Buttons include `aria-label` describing the action (e.g., "Sort by Name ascending").

Table Rows:

- Action buttons (Edit, Delete, etc.) include `aria-label` for screen readers.
- Icons inside buttons are decorative only and marked `aria-hidden="true"`.

Search Input:

- Hidden <label> using `sr-only` ensures screen readers can describe the input.
- Decorative search icon marked `aria-hidden="true"`.

Paginator:

- Wrapped in a <nav> landmark with `aria-label="Pagination"`.
- Buttons have discernible text for all breakpoints:
  - Mobile: hidden text replaced with `sr-only` labels.
  - Desktop: visible text next to icons.
- Icons inside buttons are hidden from screen readers with `aria-hidden="true"`.

Icon Buttons:

- All icons inside buttons are `aria-hidden="true"`.
- Buttons themselves have accessible names via visible text, sr-only text, or `aria-label`.

Summary:

- All interactive elements are keyboard-navigable.
- ARIA attributes are correctly used (`aria-sort`, `aria-label`).
- Landmarks (`<nav>` for paginator, `<main>` for content) aid screen reader navigation.
- Decorative icons are hidden from assistive tech.
- Tested with Axe DevTools to ensure high accessibility compliance.

#### GIT

Branch protection on master branch, can only merge with PR.

Commit guidelines: ...

#### Bundle Optimization

- This document outlines the optimizations and code-splitting strategies applied to the production build.

  1.  Build Tool & Configuration

  - Vite is used for fast builds and tree-shaking.
  - TailwindCSS is included via `@tailwindcss/vite` plugin.
  - Aliases for clean imports:
  - Rollup manualChunks configured for logical splitting.

  2.  [Manual Chunks Strategy](vite.config.ts)
      Main check has been decoupled from:

  - Larger libraries
  - Libraries and components that are not needed immediately(Modals and validation of the forms in the modals)

  3.  Lazy Loading

  Components like [modals](/src/components/ui/modal/ModalShell.tsx) are wrapped in React.lazy + Suspense:
  This ensures modal dependencies (like yup, react-modal, and modals components) load only when required.

  ***

  4.  Tree-Shaking

  - All code uses ES modules for tree-shaking.
  - Named imports normally improve tree-shaking.

#### Known issue

When creating a user I do an extra get request of the users to get the last id and to be able to assign a next one. This would not be implemented in a system with a real API that generates the IDs in the backend.
