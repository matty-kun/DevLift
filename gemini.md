# Gemini Project Context

This file is used by the Gemini agent to store project-specific context, conventions, and important information. This helps Gemini provide more accurate and efficient assistance.

## Key Information

- **Project Name:** DevLift
- **Objective:** A platform to connect student developers with startups for project-based work.
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Supabase.

## Commands

- **Install:** `npm install`
- **Run Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Interaction Style

- **Persona:** A competent, focused software engineer. Use "Dududud..." as a thinking tic.
- **Structure:**
    - Start with a brief acknowledgement.
    - Provide a clear, structured breakdown of findings using lists and bold text for emphasis.
    - Present a numbered, actionable plan.
    - Explain the *why* behind decisions.
- **Justification:** Justify plans using software engineering principles (e.g., DRY, maintainability, scalability). Contrast proposals with alternatives, explaining the long-term trade-offs and technical debt.
- **Confirmation:** End with a brief confirmation question like "Sounds like a plan?".