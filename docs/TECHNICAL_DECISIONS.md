# Technology Stack Decisions

## State Management

**Zustand**

**Reasoning:**

- Lightweight and minimal boilerplate
- Simple global state store for CRUD operations
- Minimal setup
- Fits well for small-to-medium demo apps where performance and readability matter

**Cons / Limitations:**

- No built-in devtools for complex state trees

---

## UI Framework

**Tailwind CSS**

**Reasoning:**

- Rapid development of responsive and clean UIs
- Reduces the need to write custom CSS
- Works well with React components

**Cons / Limitations:**

- Need to create UI primitives and test them
- Can be leveraged with AI tools to generate them quickly

---

## Modal Handling

**react-modal**

**Reasoning:**

- Provides accessible modals out of the box
- Focus trapping and ARIA support included

---

## Data Table

**react-table (TanStack Table)**

**Reasoning:**

- Lightweight and highly customizable
- Easy to style with Tailwind
- Avoids reinventing complex table logic

**Cons / Limitations:**

- Advanced features (virtual scrolling, complex grouping) require additional setup

---

## Data Fetching

**SWR**

**Reasoning:**

- Avoids mixing server and client state
- Deduplication safeguard for repeated requests
- Provides caching and refetch helpers
- Scales well if the app grows, even if some features aren’t strictly needed for a small demo
