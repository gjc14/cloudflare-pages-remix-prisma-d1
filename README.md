# Remix Page + Prisma Worker -> Cloudflare D1 (via RPC)

### [Live Demo](https://cloudflare-pages-remix-prisma-d1.pages.dev/)

<img width="583" alt="截圖 2024-09-07 清晨5 15 57" src="https://github.com/user-attachments/assets/400c9147-5cfd-4146-bf3e-2d8e4a9ae596">

> [!IMPORTANT]
> With the project getting larger, you may encounter `Your Worker exceeded the size limit of 1 MiB.`

Actually when I start using Prisma to call D1, this happened.

So it is inevitable to **Separate your project** and connect them with [RPC](https://blog.cloudflare.com/javascript-native-rpc/)

If you just want have a glance in how Remix Prisma and Cloudflare interact and deploy on one Page, please refer to [single-page](https://github.com/gjc14/cloudflare-pages-remix-prisma-d1/tree/single-page) branch.

## How to use

You'll have to deploy Remix on Pages by specifying /remix as root

Prisma Worker should deploy separately to a worker

# Setup D1

## 1. ⭐️ and clone the repo

```sh
git clone https://github.com/GJC14/cloudflare-pages-remix-prisma-d1.git
cd cloudflare-pages-remix-prisma-d1
```

## 2. Install dependencies

```sh
# In both remix and prisma-worker
npm install
```

## 3. Configurate `/prisma-worker/wrangler.toml` and `/remix/wrangler.toml`

binding services
YOUR_DATABASE_NAME and YOUR_DATABASE_ID, please refer to **Dashboard > Workers & Pages > D1**
Entrypoint in `/remix/wrangler.toml` should match the export `WorkerEntrypoint` in `/prisma-worker/src/index`

```
# /prisma-worker/wrangler.toml
[[ d1_databases ]]
binding = "DB"
database_name = "<YOUR_DATABASE_NAME>"
database_id = "<YOUR_DATABASE_ID>"
```

```
# /remix/wrangler.toml
[[service]]
binding = "DB"
service = "prisma-worker-test"

[[service]]
binding = "USER_SERVICE"
service = "prisma-worker"
entrypoint = "UserService"
```

## 4. Generate Env in remix and prisma-worker

You'll see `worker-configuration.d.ts` in root level defining Env for use with `@remix-run/cloudflare`

```sh
# Remix
npm run typegen

# Worker (prisma-worker)
npm run cf-typegen
```

## 5. Configure `Interface Env` to use RPC

Change the result of `npm run typegen` in `worker-configuration.d.ts`:

```ts
// /remix/worker-configuration.d.ts
// From
interface Env {
  DB: Fetcher;
  USER_SERVICE: Fetcher;
}

// To
interface Env {
  DB: Fetcher;
  USER_SERVICE: Service<UserService>;
}
```

## 6. Cloudflare D1 Migration with Prisma

### 6-1. D1 Migrate

In this case, binding is set to "DB" and I made a schema of User and Post.
This will make an empty .sql file in /migrations.

```sh
# npx wrangler d1 migrations create $DB_NAME $MESSAGE
npx wrangler d1 migrations create DB create_user_and_post_table
```

### 6-2. Generate SQL statement in the file created

This will transform `schema.prisma` into sql schema in the migration file you just created.

**Before any migrations**

```sh
# npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/$FILE_JUST_CREATED.sql
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_and_post_table.sql
```

**After first migration**

```sh
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/$FILE_JUST_CREATED.sql
```

### 6-3. Send SQL statement to D1

`--local` will be generated in `.wrangler/state`.

```sh
npx wrangler d1 migrations apply $DB_NAME --local
```

### 6-4. Generate Prisma Client to use `@prisma/client`

Now with the Database set, you could generate your Priama Client!

```sh
npx prisma generate
```

### 6-5. Use prisma

```ts
export const loader: LoaderFunction = async ({ context, params }) => {
  let env = context.cloudflare.env;
  const adapter = new PrismaD1(env["YOUR_DB_NAME"]);
  const prisma = new PrismaClient({ adapter });

  let { results } = await prisma.user.findMany();
  return json(results);
};
```

### 6-6. Finally open your services

```sh
# /prisma-worker
npm run start

# /remix
npm run dev
```

## 7. Create an online Cloudflare D1 and apply schema

Create D1 either by CLI or dashboard, name is the same as defined in `/prisma-worker/wrangler.toml`.

```sh
% npx wrangler d1 create prisma-worker-test

 ⛅️ wrangler 3.75.0
-------------------

✅ Successfully created DB 'prisma-worker-test' in region ENAM
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "prisma-worker-test"
database_id = "732f77c8-054c-4da0-a810-01544c6f1066"
```

Replace the new id in `/prisma-worker/wrangler.toml`. Then run in `prisma-worker`:

```sh
# npx wrangler d1 migrations apply $DB_NAME --remote
% npx wrangler d1 migrations apply DB --remote

 ⛅️ wrangler 3.75.0
-------------------

Migrations to be applied:
┌─────────────────────────────────────┐
│ name                                │
├─────────────────────────────────────┤
│ 0001_create_user_and_post_table.sql │
└─────────────────────────────────────┘
✔ About to apply 1 migration(s)
Your database may not be available to serve requests during the migration, continue? … yes
🌀 Executing on remote database DB (732f77c8-054c-4da0-a810-01544c6f1066):
🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
🚣 Executed 4 commands in 0.5319ms
┌─────────────────────────────────────┬────────┐
│ name                                │ status │
├─────────────────────────────────────┼────────┤
│ 0001_create_user_and_post_table.sql │ ✅       │
└─────────────────────────────────────┴────────┘
```

## 8. Deploy

### prisma-worker

You should create a D1 (step 7.) before deploy.

```sh
# /prisma-worker
npm run deploy
```

### remix

Use dashboard connect git to CI/CD.

Set binding with Prisma Worker in **Dashboard > Workers & Pages > cloudflare-pages-remix-prisma-d1 (or your Page deployment) > Settings > Functinos > Service bindings**

<img width="838" alt="截圖 2024-09-07 清晨5 10 01" src="https://github.com/user-attachments/assets/2dd5f7d9-9777-45cc-a8f1-b3aeeab9522b">

# Reference

- [Cloudflare Example: Access your D1 database in a Remix application](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/#example-access-your-d1-database-in-a-remix-application)
- [Query D1 from Remix](https://developers.cloudflare.com/d1/examples/d1-and-remix/)
- [Query D1 using Prisma ORM](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm)
- [Prisma Cloudflare D1](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1)
- [Prisma Cloudflare D1 Deploy](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare#cloudflare-d1)

## RPC

- [RPC Added to CF Workers](https://blog.cloudflare.com/javascript-native-rpc/)
- [Repo: cloudflare/js-rpc-and-entrypoints-demo](https://github.com/cloudflare/js-rpc-and-entrypoints-demo/tree/main/public-admin-api-interfaces)

---

# How I made this

Starts from official Remix Cloudflare template:

```
npx create-remix@latest --template remix-run/remix/templates/cloudflare
```

### remix

1. Added wrangler.toml
2. `npm run typegen`, you will see the change in worker-configuration.d.ts
3. Change the definition of `interface Env`
4. Removes the `interface ENV {}` in load-context.ts by template

### prisma-worker

1. `npm create cloudflare@latest` with Hello World example/Hello World Worker/TypeScript
2. `npm install prisma --save-dev @prisma/adapter-d1` `npm install @prisma/adapter-d1`
3. `npx prisma init`
4. `npm run cf-typegen`
5. Migration

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
