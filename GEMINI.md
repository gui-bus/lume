# Lume - Resume Builder

Lume is a modern, high-performance web application designed for creating, managing, and sharing professional resumes. It features an integrated ATS (Applicant Tracking System) validator, keyword matching, and a real-time PDF preview/generation engine.

## Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **PDF Generation:** [@react-pdf/renderer](https://react-pdf.org/)
- **Validation:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## Project Structure

```text
src/
├── app/              # Next.js App Router (pages, layouts, actions)
├── components/       # UI components (editor, pdf, preview, shared)
├── hooks/            # Custom React hooks
├── lib/              # Core logic, Prisma client, and utility functions
│   └── validations/  # Resume schemas, ATS validator, spellchecker
├── types/            # TypeScript definitions
└── prisma/           # Database schema and migrations
```

## Key Features

- **Resume Editor:** Interactive form-based editor with real-time validation.
- **ATS Validator:** Check resume compatibility with Applicant Tracking Systems.
- **Keyword Matcher:** Analyze resume content against job descriptions.
- **PDF Export:** High-quality PDF generation using `@react-pdf/renderer`.
- **Analytics:** Track resume views and downloads.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for local database)

### Installation

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Set up the local database using Docker:

   ```bash
   docker-compose up -d
   ```

3. Configure environment variables (copy `.env.example` to `.env` and adjust if necessary):

   ```bash
   # Example .env
   DATABASE_URL="postgresql://postgres:docker@localhost:5432/resume_db?schema=public"
   ```

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

### Running the Project

- **Development Server:**
  ```bash
  pnpm dev
  ```
- **Build for Production:**
  ```bash
  pnpm build
  ```
- **Start Production Server:**
  ```bash
  pnpm start
  ```

## Development Conventions

- **State Management:** Use React state and Next.js Server Actions for data mutations.
- **Validation:** Always use `ResumeSchema` (defined in `src/lib/validations/resume-schema.ts`) for resume data integrity.
- **Styling:** Adhere to Tailwind CSS 4 conventions and use shadcn/ui components for consistency.
- **Git Hooks:** Husky and commitlint are configured. Ensure commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- **Code Quality:** ESLint and Prettier are used for linting and formatting. Run `pnpm lint` to check for issues.
- **Comments:** Do not use `//` comments in the code. Remove any existing single-line comments.

## Testing Strategy

- **Unit Testing:** Business logic validation (ATS, Spellcheck, Matcher).
- **Component Testing:** UI interactions via Vitest + React Testing Library.
- **Pre-commit Hooks:** Automated test runs via Husky.
