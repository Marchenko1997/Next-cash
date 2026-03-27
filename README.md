# NextCash

NextCash is a personal finance tracker built with Next.js App Router. Authenticated users can create, edit, delete, and review monthly transactions, and view annual cashflow charts.

This README reflects the current codebase state as of March 26, 2026.

## What the app currently does

- Clerk authentication with protected `/dashboard` routes.
- Dashboard with:
  - Annual cashflow chart (income vs expense by month).
  - Recent transactions table.
- Transaction management:
  - Create transaction.
  - Edit transaction.
  - Delete transaction.
  - Filter transactions by month and year.
- Data persisted in PostgreSQL via Drizzle ORM.

## Tech stack

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Auth: Clerk (`@clerk/nextjs`)
- DB + ORM: PostgreSQL + Drizzle ORM + Drizzle Kit
- Forms and validation: React Hook Form + Zod
- UI: Tailwind CSS v4, shadcn/ui-style components, Radix primitives
- Charts: Recharts

## Project structure

- `app/` - App Router pages, route layouts, server actions
- `components/` - reusable UI and form components
- `data/` - server-side data access functions
- `db/` - Drizzle DB client + schema
- `drizzle/` - SQL migration files
- `schemas/` and `validation/` - client/server Zod schemas

## Environment variables

Start from `.env.example` and create a local `.env` file with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
```

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Ensure PostgreSQL is running and `DATABASE_URL` is valid.

3. Apply DB schema (choose one approach):

- Run SQL migration file manually (`drizzle/0000_tiny_speed.sql`), or
- Use Drizzle Kit commands in your preferred workflow.

4. Start dev server:

```bash
pnpm dev
```

5. Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start the development server
- `pnpm build` - build the production bundle
- `pnpm start` - run the production server
- `pnpm lint` - run ESLint
- `pnpm test` - run Vitest unit tests
- `pnpm db:generate` - generate Drizzle migrations
- `pnpm db:migrate` - apply Drizzle migrations
- `pnpm db:push` - push the schema directly to the database

## Database model (current)

- `categories`
  - `id`, `name`, `type` (`income` or `expense`)
- `transactions`
  - `id`, `user_id`, `description`, `amount`, `transaction_date`, `category_id`


