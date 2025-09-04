# AI Tools Usage Documentation

## Tools Used

### Windsurf

Code suggestions and draft snippets. These were reviewed and adapted with my own technical judgement to ensure they meet the project's standards. I think that this increases productivity however, it has downsides, many times it includes unnecessary things or makes assumptions that are incorrect.

This approach is mainly used to quickly create a structural template that I can build upon.

Example usage:

```
Generate a typed LoaderSpinner that can be reused using tailwind.
```

### Claude AI

I have used Claude AI because I can select wether the data is shared. Also I like the response more than other agents like chatgpt, for example, which it always has a very positive attitude.

Particularly, it has helped me compare technical tools and patterns using libraries that are new to me. This provides a good overview and allows me to compare my ideas with the suggestions. Additionally, it sometimes highlights things I might have overlooked. However, I make sure not to over complicate things.

**Specific Questions Asked:**

#### question:

**type:** Architecture decision consultation

I based this question on using the latest version of `json-server`.

```xml
<task>
React data table with CRUD operations for technical interview
</task>
<context>
  <stack>React + TypeScript</stack>
  <api>Single READ endpoint returns ALL data (no server search, only allows pagination)</api>
</context>
<constraints>
  <item>Balance initial load vs runtime performance</item>
  <item>Memory usage considerations</item>
</constraints>
<decisions>
  <rendering>Virtual scrolling vs client side pagination</rendering>
  <search>Real time filtering vs debounced vs button triggered</search>
  <navigation>Modal overlays vs multi route</navigation>
  <forms>Inline editing vs dedicated forms</forms>
  <updates>Optimistic vs pessimistic CRUD updates</updates>
</decisions>
<criteria>
  <item>Performance (load + runtime)</item>
  <item>UX and accessibility</item>
  <item>Implementation complexity</item>
  <item>Maintainability</item>
</criteria>
<output>
  <item>Trade off analysis per decision</item>
  <item>Recommended architecture with rationale</item>
  <item>Implementation priority order</item>
</output>
```

Based on the output of this prompt I recollected some thoughts:

**Navigation:**
would prefer single page app. -> No router.

**Rendering:**
For a small demo, I prefer using pagination rather than infinite scrolling. This reduces the number of elements displayed at once and keeps the table manageable. The search bar allows users to quickly find specific items, which is especially helpful if the table has multiple pages. Without pagination, users might scroll too much or lose track of what they are looking for.

**Search:**
I prefer debounced searches because they provide a smoother user experience than button-triggered searches. Searching on every keystroke can feel too “flashy” and may negatively impact performance.

**Updates:**
Due the time constrain to implement this, I will go with pessimistic updates.

#### question:

**type:** Architecture decision consultation

Compare some UI frameworks:

```xml
<task>
    Compare these UI component libraries/frameworks in a table format: Material UI, BaseWeb, Radix UI, and Tailwind CSS.
</task>
<comparison_criteria>
    <item>Design philosophy </item>
    <item>Learning curve </item>
    <item>Customization flexibility </item>
    <item>Bundle size impact </item>
    <item>Table component </item>
    <item>Modal/Dialog component </item>
    <item>Styling approach</item>
    <item>Best suited for</item>
</comparison_criteria>
<output_format>
    Create a comparison table with frameworks as columns and criteria as rows. For Table and Modal/Dialog components, specify if they're included out-of-the-box or require additional libraries. Keep descriptions brief and actionable.
</output_format>
```

I decided for tailwind + react table(tanstack) + react-modal(accessibility support) for its lightweight. Every other component will be able to be styled with some basic tailwind classes.

#### question:

**type:** Architecture decision consultation

Compare state management libraries:

```xml
<task>
    Compare these React state management solutions in a table format: Zustand, Redux, useContext, and Jotai.
</task>

<comparison_criteria>
    <item>Philosophy</item>
    <item>Learning curve</item>
    <item>Bundle size</item>
    <item>Boilerplate</item>
    <item>Performance</item>
    <item>DevTools</item>
    <item>Async handling</item>
    <item>Type safety</item>
    <item>State structure</item>
    <item>Middleware/Extensibility</item>
    <item>Testing</item>
    <item>Best suited for</item>
</comparison_criteria>

<output_format>
    Create a comparison table with state management solutions as columns and criteria as rows. For async handling and DevTools, specify if they're built-in, require additional setup, or need third-party solutions. Keep descriptions brief and actionable.
</output_format>
```

I ended up picking zustand for its lightweight, no boilerplate like redux and simplicity.

#### question

Generate 100 results of mock data in json format with this structure:

```
{
      "id": ID,
      "name": string,
      "email": string,
      "createdAt": Date,
      "updatedAt": Date
    }
```

#### question

- Show me good patterns using zusthand.

First time using zusthand and I wanted to speed up learning curve.
