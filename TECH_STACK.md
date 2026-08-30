# 🚀 Yugo Project Tech Stack Overview

This file serves as the single source of truth for the technology stack used across all projects in the Yugo monorepo. Use this guide to quickly answer questions about what technologies we use, where we use them, and why.

---

## 💬 What Should You Say When Someone Asks "What is your tech stack?"

### ⚡ 30-Second Elevator Pitch (Quick Answer)
> *"We build on a **TypeScript Monorepo** managed with **Turborepo** and **Yarn Berry**.*
> *Our **Backend** is powered by **NestJS** with **TypeORM**, **MySQL**, **Redis**, and an asynchronous event worker using **Inngest**.*
> *Our **Mobile App** is built with **React Native** and **Expo Router** using **Tailwind CSS (Uniwind)**, **Zustand**, and **TanStack Query**.*
> *Our **Admin Web Dashboard** uses **React 19** and **React Router v7** with **Radix UI** and **Tailwind CSS v4**.*
> *Our **DevOps & Infrastructure** is containerized with **Docker**, reverse-proxied via **Traefik**, and deployed using **Drone CI** on **DigitalOcean**."*

---

## 📊 Tech Stack Overview Matrix

| Project / Component | Tech Stack | Purpose / What it handles |
| :--- | :--- | :--- |
| **Monorepo Core** | Turborepo, Yarn 4 (Berry), TypeScript, ESLint, Prettier | Multi-package repository orchestration, shared dependencies, build caching, and code formatting. |
| **Backend API** (`apps/api`) | NestJS (v11), TypeORM, MySQL, Redis, TypeBox, CASL, Passport JWT, Scalar/Swagger | Primary REST API handling business logic, database CRUD operations, authentication, and authorization. |
| **Worker Service** (`apps/henchmen`) | NestJS, Inngest, FCM (Firebase), Handlebars, Pino | Background job processing, scheduled tasks, email notifications, push notifications, and heavy async processing. |
| **Mobile App** (`apps/app`) | React Native (0.81), Expo (v54), Expo Router, Uniwind (Tailwind), Zustand, TanStack Query, React Hook Form + Zod, Razorpay, FlashList, Maestro | Cross-platform (iOS & Android) consumer application with file-based routing, real-time map/camera integration, and end-to-end testing. |
| **Admin Backoffice** (`apps/backoffice`) | React 19, React Router v7, Vite, Tailwind CSS v4, Radix UI, TanStack Table, TanStack Query | Internal administrative web dashboard for managing system data, users, analytics, and platform configurations. |
| **CLI Tool** (`apps/cli`) | Nest Commander, Inquirer, TypeORM Extension, Chalk | Command-line utility for developers to run seeds, database migrations, and administrative maintenance commands. |
| **Internal Shared Packages** (`packages/*`) | Custom TypeScript modules (`@yugo/*`) | Shared code across apps: CQRS pattern, Database entities, CASL permission guards, Inngest decorators, FCM helper, shared types & utils. |
| **Infrastructure & DevOps** | Docker, Docker Compose, Traefik v3, Watchtower, Drone CI, DigitalOcean Container Registry | Containerization, auto SSL certificate provisioning, continuous integration pipelines, and automated deployments. |

---

## 🔍 Detailed Stack Breakdown by Component

### 1. 🏗️ Monorepo & Core Tooling (`/`)
* **Turborepo (`turbo`)**: Orchestrates builds, test execution, and development servers across all apps with intelligent caching to speed up CI/CD.
* **Yarn 4 (Berry) Workspaces**: Manages monorepo packages without dependency duplication (`apps/*` and `packages/*`).
* **TypeScript (v5.7+)**: Enforces end-to-end type safety across both frontend and backend projects.
* **ESLint & Prettier**: Custom shared linting and formatting configs (`@yugo/eslint`, `@yugo/tsconfig`) ensuring consistent code quality.

---

### 2. ⚙️ Backend Services

#### A. Core Backend API (`apps/api`)
* **NestJS (v11)**: Enterprise Node.js framework providing clean, modular architecture (Dependency Injection, Controllers, Services, Modules).
* **TypeORM & MySQL (`mysql2`)**: TypeORM maps TypeScript classes to relational MySQL tables for reliable transactional data persistence.
* **Redis (`ioredis`, `@liaoliaots/nestjs-redis`)**: In-memory data store used for high-speed caching and temporary session/token data.
* **TypeBox (`@sinclair/typebox`)**: Replaces `class-validator` for ultra-fast JSON schema validation and DTO serialization.
* **CASL (`@yugo/nestjs-casl`, `@yugo/permissions`)**: Fine-grained, attribute-based access control (ABAC) for permissions and authorization rules.
* **Passport.js & JWT**: Secure user authentication via JSON Web Tokens.
* **AWS SDK (S3)**: Cloud object storage for uploading images, documents, and media assets.
* **Scalar & Swagger (`@scalar/nestjs-api-reference`)**: Automatically generates interactive OpenAPI specification documentation.

#### B. Asynchronous Background Worker (`apps/henchmen`)
* **NestJS Worker**: A standalone process decoupled from the main HTTP API so long operations never block user request responses.
* **Inngest (`inngest`, `@yugo/nestjs-inngest`)**: Event-driven background job engine that manages retries, scheduled crons, and async workflows (OTP delivery, email triggers, battery status sync).
* **Firebase Cloud Messaging (FCM)**: Sends native push notifications to mobile devices.
* **Handlebars**: Compiles dynamic HTML templates for transactional emails.
* **Pino (`nestjs-pino`)**: High-performance structured JSON logging.

---

### 3. 📱 Mobile Application (`apps/app`)
* **React Native (v0.81)**: Cross-platform native mobile application engine.
* **Expo (v54)**: Development framework and native module manager, enabling rapid building via EAS (Expo Application Services).
* **Expo Router (v6/v54)**: Native navigation using file-based routes (`app/` directory).
* **Uniwind / Tailwind CSS v4**: Utility-first mobile styling framework powered by `react-native-css-interop`.
* **Zustand**: Lightweight global client state management for UI states, user settings, and local flags.
* **TanStack React Query (v5)**: Server state management for caching, optimistic updates, and automatic re-fetching of backend data.
* **React Hook Form + Zod**: Uncontrolled, high-performance mobile form validation with schema enforcement.
* **xior**: Modern, ultra-lightweight HTTP client (Axios alternative).
* **Shopify FlashList**: High-performance virtualized lists replacing standard React Native FlatLists.
* **React Native Razorpay**: Native payment gateway integration for user billing.
* **React Native Maps & Camera**: Interactive maps, pin locations, camera permissions, and media capture.
* **Maestro**: Declarative UI end-to-end (E2E) automation testing framework.

---

### 4. 💻 Admin Web Dashboard (`apps/backoffice`)
* **React (v19)**: Modern React UI library.
* **React Router v7**: Full-stack web framework providing file-based routing, nested layouts, and server-side data loaders.
* **Vite**: Ultra-fast frontend bundler and development server.
* **Tailwind CSS v4**: Next-gen CSS framework with native `@tailwindcss/vite` integration.
* **Radix UI**: Accessible, unstyled UI primitives (Dialogs, Dropdowns, Tabs, Popovers, Tooltips) customized for the internal design system.
* **TanStack Table (v8)**: Powerful data grid for sorting, filtering, and paginating admin records.
* **TanStack Query (v5)**: Data fetching and cache synchronization with backend endpoints.
* **Recharts**: Interactive chart visualizations for business metrics and reporting.

---

### 5. 🛠️ CLI & Utility App (`apps/cli`)
* **Nest Commander (`nest-commander`)**: Builds command-line applications leveraging NestJS dependency injection.
* **Inquirer & Chalk**: Interactive command-line prompts and colorful terminal diagnostics.
* **TypeORM Extension**: Command-line database seeding and migration execution.

---

### 6. 📦 Internal Shared Packages (`packages/*`)
To avoid repeating code, shared logic is extracted into internal npm workspace packages:
* `@yugo/cqrs`: Custom Command Query Responsibility Segregation logic (separating read models from write models).
* `@yugo/nestjs-database`: Shared TypeORM entity schemas, base repositories, and DB connections.
* `@yugo/nestjs-casl`: Shared role policies, action definitions, and authorization guards.
* `@yugo/nestjs-inngest`: Standardized NestJS Inngest module wrappers.
* `@yugo/nestjs-fcm`: Shared Firebase Cloud Messaging module.
* `@yugo/shared`: Universal TypeScript interfaces, enums, DTOs, and shared domain constants.
* `@yugo/utils`: Universal helper functions.

---

### 7. 🌐 Infrastructure, DevOps & Deployment (`infra/`)
* **Docker & Docker Compose**: Multi-container containerization for API, worker, proxy, and backoffice services.
* **Traefik (v3.6)**: Edge reverse proxy with automated Let's Encrypt SSL certificate generation and domain routing.
* **Watchtower**: Automatically updates running Docker containers when new builds are pushed.
* **Drone CI**: Automated CI/CD pipeline executing test and docker build/push steps on DigitalOcean.
* **DigitalOcean Container Registry (DOCR)**: Private Docker registry (`registry.digitalocean.com/yugo-builds`).

---

## 🎯 Quick Cheat-Sheet: "Where is X used?"

* **Where is MySQL used?** → Main backend database for `apps/api` and `apps/henchmen` (configured via `@yugo/nestjs-database`).
* **Where is Redis used?** → Caching layer in `apps/api` and `apps/henchmen`.
* **Where is Inngest used?** → Background worker (`apps/henchmen`) for async queues and cron jobs.
* **Where is Expo / React Native used?** → Mobile mobile app (`apps/app`).
* **Where is React Router v7 used?** → Web backoffice admin dashboard (`apps/backoffice`).
* **Where is Docker / Traefik used?** → Infrastructure deployment (`docker-compose.yml`).
* **Where is Tailwind CSS used?** → Mobile (`apps/app` via Uniwind) and Web (`apps/backoffice` via Tailwind v4).
