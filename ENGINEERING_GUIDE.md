# Engineering Guide

## 1. Project Overview

Welcome to the engineering guide for **Nanowrit Labs**, a **Community-Greenlit Studio**. This document is the primary resource for developers working on this codebase.

### Purpose

This application is a platform where **Creatives** develop and test ideas for free, and **Backers** (Producers & Executive Producers) fund a collective **Production Fund** via annual subscriptions. The core value proposition is the "Community Greenlight": Backers vote on which validated projects get funded and produced.

### Project History & Philosophy

This project was originally forked from `CMSaasStarter` and initially developed as a generic transmedia tool. We have since pivoted to the **Community-Greenlit Studio** model.

While the underlying architecture (SvelteKit, Supabase, Stripe) remains the same, the focus is now on two distinct user journeys:

1.  **Creatives:** Using the "World Building" and "Story Building" tools to create content and build an audience.
2.  **Producers:** Using the "Dashboard" and "Billing" features to manage their subscriptions (which fuel the Production Fund) and cast "Greenlight Votes" on projects.

### How to Use This Guide

**This `ENGINEERING_GUIDE.md` is the canonical, up-to-date source of truth for understanding the application's architecture and purpose.**

The original `README.md` is now partially outdated. It should **only** be used for its initial setup instructions (e.g., `npm install`, environment variable setup). Its description of the project as a generic "SaaS template" should be disregarded.

## 2. Core Application Features

The core of this application is found within the user account section (`src/routes/(admin)/account/`). Features are split between tools for Creatives and governance/funding features for Producers.

- **Dashboard (`/account`):** The main hub. For Creatives, it tracks project stats. For Producers, it shows the status of the **Production Fund** and active **Greenlight Votes**.
- **World & Story Building (`/account/world-building`, `/account/story-building`):** The "Free Tools" for Creatives to develop their IP.
- **Premises & Pitches (`/account/premises`):** Where Creatives refine their concepts into pitch-ready projects for the community to vote on.
- **Billing (`/account/billing`):** Manages the **Producer ($250/yr)** and **Executive Producer ($500/yr)** subscriptions. 90% of this revenue goes directly to the Production Fund.
- **Team Collaboration (`/account/teams`):** Allows Creatives to form teams around a project.
- **User Settings (`/account/settings`):** Profile management, including "Credits" preferences (how a user wants to be credited in produced works).

## 3. Codebase Architecture

This project is built with SvelteKit, a full-stack web framework. Understanding its conventions is key to working with the codebase.

### High-Level Directory Structure

- `src/`: Contains all the application source code. This is where you'll spend most of your time.
- `supabase/`: Contains database migration files.
- `static/`: Contains static assets like images and fonts.
- `.github/`: Contains CI/CD workflow definitions for GitHub Actions.

### The `src` Directory

The `src` directory is the heart of the application. Here's a breakdown of the key subdirectories:

- `lib/`: This is for shared libraries, modules, and utilities.
  - `lib/components/`: Shared Svelte components used across multiple pages.
  - `lib/server/`: Server-side code that should never be exposed to the client. This includes data loaders and other sensitive logic.
  - `lib/emails/`: Handlebars templates for transactional emails.
  - `lib/types.ts`: Shared TypeScript type definitions.
- `routes/`: This is where SvelteKit's file-based routing lives. Every folder and file inside `routes` defines a page or an API endpoint for the application.

### SvelteKit Routing

The `src/routes` directory has a special structure:

- **Pages:** A file named `+page.svelte` creates a new page at that route. For example, `src/routes/about/+page.svelte` creates the `/about` page.
- **Server-Side Logic:** A file named `+page.server.ts` can export a `load` function to fetch data for its corresponding `+page.svelte` file. This code runs only on the server.
- **Layouts:** `+layout.svelte` files create a layout that wraps multiple pages. This is used for shared elements like headers, footers, and sidebars.
- **Route Groups:** Directories enclosed in parentheses, like `(marketing)` and `(admin)`, are called route groups. They allow us to apply different layouts to different sections of the site without affecting the URL structure.
  - `(marketing)/`: Contains the public-facing pages like the homepage, login, and pricing.
  - `(admin)/`: Contains the core, behind-a-login application logic. The majority of the custom application features reside here.

## 4. Backend and Data

The backend is powered by Supabase, which provides our database, authentication, and file storage.

### Authentication

The authentication flow is handled by a combination of Supabase Auth and SvelteKit server hooks.

- **`src/hooks.server.ts`**: This is the most important file for understanding authentication. On every server-side request, it initializes a Supabase client and uses the user's cookies to determine their authentication state. It makes the user's session and profile data available to all server load functions and API routes via the `event.locals` object.
- **Auth UI:** The sign-up and login pages are located in `src/routes/(marketing)/login/`. They use the official `@supabase/auth-ui-svelte` component for a pre-built, secure user interface.
- **Protected Routes:** The root layout for the admin section, `src/routes/(admin)/account/+layout.server.ts`, checks for a valid user session. If no user is logged in, it redirects them to the login page, effectively protecting all core application routes.

### Database

We use Supabase's built-in Postgres database.

- **Schema Migrations:** The database schema is managed via SQL migration files located in `supabase/migrations/`. To make a schema change, create a new `.sql` file in this directory and apply it to your local and production databases. The initial schema, which includes tables for `profiles` and `stripe_customers`, can be found in `database_migration.sql`.
- **Database Access:** All database access should be performed on the server-side (in `+page.server.ts` or `+server.ts` files) using the Supabase client.

### Graph Database Design

To support the complex relationships in transmedia storytelling (e.g., "Character A _hates_ Character B" or "Location X _contains_ Item Y"), we implement a graph structure using relational tables:

- **Nodes (`elements` table):** Every story element (Character, Location, Plot Point) is a row in the `elements` table. It stores the `type` (e.g., "character") and a JSONB `properties` column for flexible, schema-less data attributes.
- **Edges (`relationships` table):** Connections between elements are stored in the `relationships` table. Each row represents a directed edge with a `source_element_id`, `target_element_id`, and a `type` (e.g., "parent_of", "located_in").
- **Traversal:** We currently handle graph traversal at the application layer. For example, to find all characters in a location, we query the `relationships` table for edges where `target_element_id` matches the location's ID.

### Data Loading

Data for pages is fetched on the server within `load` functions in `+page.server.ts` files.

- **Example Data Loader:** A key example of our data loading strategy can be found in `src/lib/server/data-loaders.ts`. The `getTeamsWithWorldsAndElements` function demonstrates how we query Supabase for nested data structures (teams containing worlds, which contain elements) and then process them in JavaScript. This pattern of co-locating complex queries into reusable functions in `lib/server/` is a best practice we follow in this project.

## 5. Key Technical Patterns & Integrations

This section covers important configuration patterns and third-party services integrated into the application.

### Configuration

All secret keys and environment-specific variables are managed using `.env` files.

- **`.env.example`**: This file serves as a template for all required environment variables.
- **`.env.local`**: For local development, copy `.env.example` to `.env.local` and fill in the values. This file is ignored by git.
- **Production**: In production (e.g., on Cloudflare Pages), these variables must be set in the hosting provider's dashboard.

The application uses `$env/static/public` for public variables and `$env/static/private` or `$env/dynamic/private` for private server-side keys.

### Service Integrations

Several third-party services are integrated, mostly inherited from the original SaaS template.

- **Stripe:** Used for handling payments and subscriptions. The primary logic is in `src/routes/(admin)/account/billing/` and `src/routes/(admin)/account/subscribe/`. The `PRIVATE_STRIPE_API_KEY` environment variable is required.
- **Resend:** Used for sending transactional emails (e.g., welcome emails).
  - **Implementation:** The core logic is in `src/lib/mailer.ts`.
  - **Docs:** For details on enabling and customizing emails, see `email_docs.md`.
- **PostHog:** Used for product analytics.
  - **Implementation:** PostHog is initialized for all pages in the root layout `src/routes/+layout.svelte`.
  - **Docs:** For more information, see `analytics_docs.md`.

## 6. Development Workflow

This section provides practical advice for setting up your local environment and contributing to the project.

### Getting Started

1.  **Initial Setup:** Follow the instructions in the `README.md` for cloning the repository, installing dependencies (`npm install`), and setting up your `.env.local` file with the necessary Supabase and Stripe keys.
2.  **Run the Dev Server:** Start the local development server with `npm run dev`.
3.  **Database Migrations:** Ensure your local Supabase instance has all the latest database schema changes by applying any new migrations from the `supabase/migrations` directory.

### Testing

The project uses `vitest` for unit and integration testing.

- **Run All Tests:** `npm run test`
- **Run in Watch Mode:** `npm run test`
- **Adding New Tests:** Test files are co-located with the code they are testing and have a `.test.ts` extension. For example, tests for `src/lib/mailer.ts` are in `src/lib/mailer.test.ts`.

### Extending the Application

When adding a new feature, use the existing structure as a guide. For example, to add a new "Props" feature for managing story props:

1.  **Create a new route:** Add a new directory `src/routes/(admin)/account/props/`.
2.  **Add the page:** Create a `+page.svelte` file inside the new directory to be the main UI for the feature.
3.  **Add server logic:** Create a `+page.server.ts` file to load the data for your page from Supabase.
4.  **Create data loaders:** If the data logic is complex, add a new function to `src/lib/server/data-loaders.ts` or a new, specific data-loader file.
5.  **Add components:** If you create reusable components, place them in `src/lib/components/`.
6.  **Add database tables:** If the feature requires new database tables, create a new SQL migration in `supabase/migrations/`.
