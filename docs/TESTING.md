# Testing Documentation

## Overview

This project uses **Vitest** as the testing framework with comprehensive unit and integration testing coverage. The testing setup includes component testing using React Testing Library, API mocking, and code coverage reporting.

## Testing Framework & Tools

- **Testing Framework**: [Vitest](https://vitest.dev/)
- **Component Testing**: [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)
- **DOM Assertions**: [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)
- **Test Environment**: JSDOM
- **Coverage Provider**: V8

## Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### Current Coverage Metrics

As of the last run:

- **Statements**: 95.03%
- **Branches**: 89.93%
- **Functions**: 91.17%
- **Lines**: 95.03%

### Coverage Thresholds

The project enforces the following coverage thresholds:

- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 80%

### Coverage Configuration

Coverage includes:

- All TypeScript/TSX files in `src/`
- Excludes: type definitions, index files, main.tsx, and type-only directories

## Test Structure

### Test Files Organization

The project contains **38 test files** with **357 tests** organized as follows:

```
src/
├── components/
│   ├── data-table/__tests__/
│   ├── feedback/__tests__/
│   ├── forms/__tests__/
│   └── ui/
│       ├── __tests__/
│       ├── modal/__tests__/
│       └── table/__tests__/
├── features/users/
│   ├── components/__tests__/
│   ├── hooks/__tests__/
│   └── services/__tests__/
├── schemas/__tests__/
├── services/__tests__/
├── stores/__tests__/
└── utils/__tests__/
```

### Test Categories

#### 1. Unit Tests

- **UI Components**: Button, IconButton, LoadingSpinner, ErrorMessage, etc.
- **Utility Functions**: Date utilities, debounce functions
- **Hooks**: Custom React hooks for user operations
- **Services**: API client and user service functions
- **Stores**: Zustand store logic
- **Schemas**: Yup validation schemas

#### 2. Integration Tests

- **User Flows**: Complete CRUD operations
- **Form Interactions**: Modal forms with validation
- **Data Table**: Search, pagination, and sorting functionality
- **Component Interactions**: Modal opening/closing, user actions

#### 3. Component Tests

- **Rendering**: Components render correctly with props
- **User Interactions**: Click, input, form submission
- **Conditional Rendering**: Loading states, error states
- **Accessibility**: ARIA attributes, keyboard navigation

## Coverage Details by Module

### High Coverage Areas (>95%)

- **Services & API Client**: 100% coverage
- **Schemas & Validation**: 100% coverage
- **Stores**: 100% coverage
- **Form Components**: 100% coverage
- **Feedback Components**: 100% coverage

### Areas for Improvement (<90%)

- **Data Table Components**: 90.95% (some edge cases in sorting logic)
- **UI Modal Components**: 87.09% (error handling paths)
- **Utility Functions**: 90.9% (date formatting edge cases)

## Test Setup & Configuration

### Vitest Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
      },
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "**/*.d.ts",
        "src/types/**",
        "src/**/types/**",
        "dist/**",
        "**/types.ts",
        "src/**/index.ts",
        "src/main.tsx",
      ],
    },
  },
});
```

### Test Setup File

The project uses `src/test/setup.ts` to configure:

- Jest DOM matchers
- Mock implementations
- Global test utilities

## Known Issues & Warnings

### Current Warnings

1. **HTML Validation Warning**: `<th>` cannot be child of `<div>` - Non-critical hydration warning
2. **Act Warning**: Some async state updates not wrapped in `act()` - Does not affect test reliability

These warnings are minor and don't impact test functionality or reliability.

## Future Testing Improvements

### Missing Test Coverage

- **Delete User Integration Tests**: Currently mentioned as a gap in improvements
- **Error Boundary Testing**: Edge cases for error handling
- **Performance Testing**: Large dataset handling

### Recommended Additions

- **E2E Testing**: Cypress for full user flows in real browser environment
- **Visual Regression Testing**: BackstopJS for style consistency
- **Component Visual Testing**: Storybook with visual testing tools

## Best Practices Followed

### Testing Library Principles

- Test behavior, not implementation
- Query by accessibility roles and labels
- Use user-event for realistic interactions
- Assert on what users see/experience

### Test Organization

- Tests with components
- Descriptive test names
- Grouped related tests with `describe` blocks

### Mocking Strategy

- Mock external APIs and services
- Mock heavy dependencies (modals, complex UI)
- Preserve component integration where valuable

## Running Tests

### Local Development

```bash
# Run all tests with coverage
npm run test:coverage

# Run specific test file
npx vitest src/components/ui/__tests__/Button.test.tsx

# Debug tests with UI
npm run test:ui
```

### CI/CD Integration

Tests run automatically on:

- Pull requests
- Main branch commits
- Release builds

The build fails if coverage thresholds are not met.
