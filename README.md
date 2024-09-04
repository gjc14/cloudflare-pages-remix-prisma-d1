# Remix + Prisma + Cloudflare D1 (WIP)

## How to use

1. Clone the repo

```sh
git clone https://github.com/GJC14/cloudflare-remix-prisma-d1.git
```

2. Install dependencies

```sh
npm install
```

3. Configurate wrangler.toml

binding for name in the application
YOUR_DATABASE_NAME and YOUR_DATABASE_ID, please refer to **Dashboard > Workers & Pages > D1**

```
[[ d1_databases ]]
binding = "DB"
database_name = "<YOUR_DATABASE_NAME>"
database_id = "<YOUR_DATABASE_ID>"
```

## Reference

- [Cloudflare Example: Access your D1 database in a Remix application](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/#example-access-your-d1-database-in-a-remix-application)
- [Query D1 from Remix](https://developers.cloudflare.com/d1/examples/d1-and-remix/)

## How I made this

Starts from official Remix Cloudflare template:

```
npx create-remix@latest --template remix-run/remix/templates/cloudflare
```

1. Added wrangler.toml
2. `npm run typegen`, you will see the change in worker-configuration.d.ts
3. Removes the `interface ENV {}` in load-context.ts by template

**You're good to go if you'd like to use raw D1 query.**

---

# Welcome to Remix + Cloudflare!

- 📖 [Remix docs](https://remix.run/docs)
- 📖 [Remix Cloudflare docs](https://remix.run/guides/vite#cloudflare)

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
