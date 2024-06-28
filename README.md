This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
