# Git Workflow

## Branch Protection

Branch protection on master branch, can only merge with PR.

## Branching Strategy

- main: Production-ready code
- develop: Integration branch for features
- issue#<issue-number>: Individual feature development

# Commit Guidelines

- **Reference issues in commit messages.**  
  Start all commits with the related issue number. This ensures:

  - Commits are automatically linked to issues, improving traceability.
  - Hovering over a commit shows a preview of the issue (title, description, labels).
  - Progress can be easily tracked across issues.

  For organizations with multiple repositories, use the format: `<organization>/<repository>#<issue-number>`
  Example: `lluisemper/vw#41`

- **Add meaningful comments.**  
  Besides referencing the issue, include a short explanation of what the commit does and why.

- **Use commit templates and validation.**  
  In team environments, I prefer to:
  - Define a commit message template (e.g., via Git config).
  - Add a pipeline step or Git hook to enforce the commit message format.
