/**
 * templates.js
 * ------------
 * Central config for all available templates.
 *
 * To ADD A NEW TEMPLATE:
 *   1. Add an entry here (id, name, icon, description, sample).
 *   2. Add a matching CSS block ".template-<id>" in src/styles/templates.css
 *   3. Add a matching style entry in backend/templates/templateStyles.js
 * The rest of the app (selector, preview, export) works automatically.
 */

export const TEMPLATES = [
  {
    id: "resume",
    name: "Resume",
    icon: "📄",
    description: "Clean, modern resume/CV layout",
    sample: `# Jordan Lee
## Summary
Frontend developer with 3 years of experience building responsive web apps with React and modern CSS.

## Experience
- Software Engineer, Acme Corp (2023 - Present)
- Junior Developer, Bright Labs (2021 - 2023)

## Education
- B.Sc. Computer Science, State University

## Skills
- JavaScript, React, Node.js
- Git, REST APIs, Figma`,
  },
  {
    id: "letter",
    name: "Business Letter",
    icon: "✉️",
    description: "Formal letter with date and closing",
    sample: `# Application for Partnership Proposal

Dear Ms. Rodriguez,

I am writing to formally propose a partnership between our two companies. Over the past year, our teams have collaborated closely, and I believe a deeper alliance would benefit both organizations.

We would like to schedule a meeting next week to discuss the terms in detail. Please let me know a time that works for you.

Thank you for considering this proposal.`,
  },
  {
    id: "report",
    name: "Project Report",
    icon: "📊",
    description: "Structured report with numbered sections",
    sample: `# Website Redesign Project Report

## Introduction
This report summarizes the redesign of the company website, carried out between January and March.

## Methodology
- Conducted user interviews with 12 participants
- Built wireframes and interactive prototypes
- Ran two rounds of usability testing

## Results
The redesign improved task completion rate from 62% to 89% and reduced average load time by 40%.

## Conclusion
The new design significantly improved user experience and is recommended for full rollout.`,
  },
];

export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
