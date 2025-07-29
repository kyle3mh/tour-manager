# Tour Manager

**Tour Manager** is a smart tour-planning dashboard built for **artist managers and booking agents**. It helps coordinate artist availability, match it with venue options across multiple cities.

---

## Monorepo Structure

This project uses a `pnpm`-based monorepo for clean separation of backend and frontend:

/tour-manager
├── payload-backend # Payload CMS – auth, venues, tours, users
├── frontend # Next.js 15 app – UI for artist managers


Managed with a [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) file.

---

## Tech Stack

| Area       | Tech |
|------------|------|
| Frontend   | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend    | Payload CMS, MongoDB Atlas, GraphQL |
| Auth       | JWT-based auth via Payload |
| State      | React state |
| Hosting    | to be decided |

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
