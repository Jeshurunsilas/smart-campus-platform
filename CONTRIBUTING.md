# Contributing Guidelines

Thank you for your interest in contributing to the **Smart Campus and Service Request Management Platform**!

## 1. Code of Conduct
We are dedicated to providing a respectful, welcoming, and harassment-free environment for all contributors, regardless of experience level, gender identity, or background.

---

## 2. Development Workflow

1. **Fork & Branch:**
   Create a feature branch from `master`:
   ```bash
   git checkout -b feature/SCP-XXX-description
   ```

2. **Commit Message Conventions:**
   Follow standard Conventional Commits with JIRA ticket references:
   - `feat(SCP-401): add student request creation photo validation`
   - `fix(SCP-502): resolve role validation check on account approval`
   - `test(SCP-703): add integration tests for technician work order flow`
   - `docs(SCP-901): update API reference manual`

3. **Pre-Commit Quality Checklist:**
   Before opening a pull request, verify:
   ```bash
   # 1. Zero ESLint errors or warnings
   npm run lint

   # 2. Zero TypeScript errors
   npx tsc --noEmit

   # 3. All Vitest tests pass
   npm test

   # 4. Successful production build
   npm run build
   ```

4. **Pull Request Protocol:**
   - Link the relevant JIRA ticket key (`SCP-XXX`) in the PR title.
   - Include a concise summary of the changes and a screenshot for UI modifications.
   - All CI checks (GitHub Actions / Jenkins) must pass before merging.
