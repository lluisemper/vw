# Project Assumptions

## API

- CRUD operations (GET, POST, PUT, DELETE) succeed if requests are properly formatted
- Data shape is consistent across all items
- No authentication or authorization is required
- Assume API returns all items for GET; client handles pagination and filtering

## Functional & UI Expectations

- DataTable supports searching across all fields(**except** `createdAt` and `updatedAt`, which only support sorting), sorting, and intuitive CRUD operations
- Selecting an item displays it in a detail component
- Assume responsive layouts for mobile and tablet devices
- Basic accessibility implemented (keyboard navigation, ARIA attributes, focus management)

## Data

- Asynchronous data shows loading states
- Errors display user-friendly messages
- Assume no backend validation errors for demo purposes

## Quality

- Code follows clean code principles and SOLID design where practical
- Performance optimizations applied: lazy loading, memoization, code splitting
- Unit tests cover core functionality; full coverage not required
- CI/CD pipeline handles automated testing and deployment (Vercel for preview & production)
