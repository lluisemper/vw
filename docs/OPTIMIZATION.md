# Performance Optimization

## Runtime Optimizations

### Lazy Loading

Lazy load of the modal and validation, only loaded when needed.

### Table Optimization

Main table is not using Suspense, instead uses an AsyncBoundary. If we were to wrap the main part of the app in a Suspense, this would create another chunk and probably react would delay rendering of the entire subtree.

There is a useMemo to stop the columns from the tanstack table from rendering more than necessary, this was recommended by tanstack documentation.

### Search Debouncing

Search is debounced depending of the size of the data set:

- **No debouncing** when less than 100 results
- **Light debouncing** between 100 and 1000 dataset results
- **500ms debouncing** when more than 1000 results

## Bundle Optimization

This document outlines the optimizations and code-splitting strategies applied to the production build.

### 1. Build Tool & Configuration

- **Vite** is used for fast builds and tree-shaking
- **TailwindCSS** is included via `@tailwindcss/vite` plugin
- **Aliases** for clean imports
- **Rollup manualChunks** configured for logical splitting

### 2. Manual Chunks Strategy

See [vite.config.ts](../vite.config.ts) for configuration.

Main chunk has been decoupled from:

- Larger libraries
- Libraries and components that are not needed immediately (Modals and validation of the forms in the modals)

### 3. Lazy Loading Components

Components like [modals](../src/components/ui/modal/ModalShell.tsx) contains a React.lazy + Suspense

This ensures modal dependencies (like yup, react-modal, and modal components) load only when required(opening a modal) reducing the initial bundle by:

```
dist/assets/UserModals-CFLVLQ8z.js   16.21 kB │ gzip:  4.75 kB
dist/assets/modal-d7z0Noym.js        26.65 kB │ gzip:  8.64 kB
dist/assets/validation-BmnXO0AJ.js   35.49 kB │ gzip: 11.99 kB
```

### 4. Tree-Shaking

- All code uses ES modules for tree-shaking
- Named imports normally improve tree-shaking

## Known Performance Issues

When creating a user I do an extra GET request of the users to get the last ID and to be able to assign a next one. This would have not been implemented in a system with a real API that generates the IDs in the backend.
