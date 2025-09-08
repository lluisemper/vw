# Architecture Documentation

## Clean Architecture

**Folder Structure**:

```
[ Domain Layer ]
   ├── types/
   ├── schemas/
   └── features/users/types/

[ Application Layer ]
   └── features/users/services/

[ Interface Layer ]
├── UI Primitives
│     ├── components/ui/
│     ├── components/forms/
│     ├── components/feedback/
│     └── components/data-table/
│
├── Feature UI
│     └── features/users/components/
│
└── Adapters UI
      ├── features/users/hooks/
      ├── services/apiClient
      ├── stores/
      └── utils/


[ Framework ]
   ├── App.tsx
   ├── main.tsx
   └── index.css

[ Tests ]
   Wrap all layers:
   - Unit tests
   - Integration tests

One way dependency rule: Domain → Application → Interface → Framework
```

## Design Principles

### YAGNI Principle for Domain Specific Components

Domain specific components are not likely to be shared a lot. Therefore I rather keep them as simple as possible.

## Architecture Decisions

The architecture follows clean architecture principles with clear separation of concerns:

- **Domain Layer**: Contains business logic, types, and schemas
- **Application Layer**: Contains use cases, hooks, and services
- **Interface Layer**: Contains UI components and utilities(formatters, debounce for inputs...)
- **Framework Layer**: Contains application bootstrap and configuration

This structure ensures maintainability, testability, and clear dependency flow.

### DDD (Domain-Driven Design)

Borrow the feature grouping of DDD, but don’t enforce all of DDD’s abstractions unless project scale requires it.
