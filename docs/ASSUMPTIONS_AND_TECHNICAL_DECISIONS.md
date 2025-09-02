# Assumptions and Technical Decisions

## Assumptions 

### API

- CRUD operations (GET, POST, PUT, DELETE) succeed if requests are properly formatted.
- Data shape is assumed to have consistent fields for all items.
- No authentication or authorization is required.

### Functional & UI Expectations

- DataTable supports searching across all fields, sorting, and intuitive CRUD operations.
- Selecting an item displays it in a detail component.
- Responsive design is applied so tables and layouts remain usable on mobile devices.
- Accessibility basics are implemented.

### Data

- Asynchronous data shows loading states.
- Errors show error messages

### Quality

- Code follows clean code principles and SOLID design where practical.
- Performance optimizations (lazy loading, memoization, code splitting) are applied for smoother user experience.
- Unit tests cover core functionality; full coverage is not required.
- CI/CD pipeline handles automated testing and deployment


## Technology Stack Decisions

### State Management

**Zustand Reasoning:**
- Lightweight and minimal boilerplate.
- Simple global state store for CRUD operations.
- Minimal setup.
- Fits well for a small-medium demo app where performance and readability matter.

### UI Framework

**Tailwind CSS Reasoning:**
Rapid development of responsive and clean UIs.
Reduces the need to write custom CSS.

### Modal Handling

**react-modal: Reasoning:**
Provides accessible modals out of the box.

### Data Table

**react-table: Reasoning:**
- Lightweight and highly customizable table.
- PEasy to style with tailwind.
- Avoids reinventing complex table logic.
