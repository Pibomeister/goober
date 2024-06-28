This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Introduction

This project leverages a combination of hot and cold storage to solve for real-time complexity. Most of the data is persisted on a postgres database, while the real-time data is stored on a firebase database. Real time ride information is used to determine current ride status and is updated in real time. The app itself focuses on the UX/UI of a potential ridesharing application. With that in mind, real information is limited to the bare minimum functionality of handling the life cycle of a ride. Other screens are included that showcase historical information for a passenger, and what the settings and landing page could start to look like. In addition, logic involving only allowing a single ride per driver at any given point is incoprorated into the schema, but is not implemented in the business logic, again, accounting for the limited time frame to develop this solution.

## Highligts

- Next.js 14 with server actions and server + client components.
- Prisma to handle postgres DB migrations and as a type-safe ORM.
- Firebase
- Tailwind CSS
- React Firebase Hooks
- React Maps including Google Maps + Open Maps API for support for users location and geocoding from addresses.
- React Confetti

## Getting Started

Start the database:

```bash
npm run docker:up
```

Run prisma migrations

```bash
npx prisma migrate dev
```

Seed the database

```bash
npm run seed
```

Lastly, run the development server:

```bash
npm run dev
```

## Environment Variables

```
Environment variables will be sent over email
```
