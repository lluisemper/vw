# Future Improvements

## Testing

- **Style / Visual Testing**
  - Current gap: Styles not verified in real browser
  - Improvement:
    - **E2E testing** with Cypress for full user flows
    - **Visual regression testing** with BackstopJS to catch style regressions
  - Rationale: These tools provide reliable, maintainable testing environments

## UI/UX Improvements

- **Table Responsiveness**
  - Current gap: Rough horizontal scrolling on smaller screens
  - Improvement: Refine layout for better responsive tables with minimal horizontal scroll
- **Text Overflow Handling**
  - Current gap: Long names/emails in modals not optimally displayed
  - Improvement: Use Tailwind `break-word` classes or better truncation/tooltip approach to handle long text gracefully
