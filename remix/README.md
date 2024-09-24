# Remix Page + Prisma Worker -> Cloudflare D1 (via RPC)

## Warning

With the project getting larger, you may encounter `Your Worker exceeded the size limit of 1 MiB.`

Actually when I start using Prisma to call D1, this happened.

So it is inevitable to **Separate your project** and connect them with [RPC](https://blog.cloudflare.com/javascript-native-rpc/)

If you just want have a glance in how Remix Prisma and Cloudflare interact and deploy on one Page, please refer to [single-page](https://github.com/gjc14/cloudflare-pages-remix-prisma-d1/tree/single-page) branch.

## How to use

### Setup D1

1. ⭐️ and clone the repo

```sh
git clone https://github.com/GJC14/cloudflare-remix-prisma-d1.git
cd cloudflare-remix-prisma-d1
```

2. Install dependencies

```sh
npm install
```

3. Configurate `wrangler.toml`

binding for name in the application
YOUR_DATABASE_NAME and YOUR_DATABASE_ID, please refer to **Dashboard > Workers & Pages > D1**

```
[[ d1_databases ]]
binding = "DB"
database_name = "<YOUR_DATABASE_NAME>"
database_id = "<YOUR_DATABASE_ID>"
```

4. Generate D1 Env

You'll see `worker-configuration.d.ts` in root level defining Env for use with `@remix-run/cloudflare`

```sh
npm run typegen
```

### Cloudflare D1 Migration with Prisma

1. D1 Migrate

In this case, binding is set to "DB" and I made a schema of User and Post.
This will make an empty .sql file in /migrations.

```sh
# npx wrangler d1 migrations create $DB_NAME $MESSAGE
npx wrangler d1 migrations create DB create_user_and_post_table
```

2. Generate SQL statement in the file created

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

3. Send SQL statement to D1

`--local` will be generated in `.wrangler/state`.

```sh
npx wrangler d1 migrations apply $DB_NAME --local
npx wrangler d1 migrations apply $DB_NAME --remote
```

4. Generate Prisma Client to use `@prisma/client`

Now with the Database set, you could generate your Priama Client!

```sh
npx prisma generate
```

5. Use prisma

```typescript
export const loader: LoaderFunction = async ({ context, params }) => {
  let env = context.cloudflare.env;
  const adapter = new PrismaD1(env["YOUR_DB_NAME"]);
  const prisma = new PrismaClient({ adapter });

  let { results } = await prisma.user.findMany();
  return json(results);
};
```

## Reference

- [Cloudflare Example: Access your D1 database in a Remix application](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/#example-access-your-d1-database-in-a-remix-application)
- [Query D1 from Remix](https://developers.cloudflare.com/d1/examples/d1-and-remix/)
- [Query D1 using Prisma ORM](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm)
- [Prisma Cloudflare D1](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1)
- [Prisma Cloudflare D1 Deploy](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare#cloudflare-d1)

## How I made this

Starts from official Remix Cloudflare template:

```
npx create-remix@latest --template remix-run/remix/templates/cloudflare
```

### remix folder

1. Added wrangler.toml
2. `npm run typegen`, you will see the change in worker-configuration.d.ts
3. Change the definition of `interface Env`
   Change the result of `npm run typegen` in `worker-configuration.d.ts`, it will be:

```ts
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

4. Removes the `interface ENV {}` in load-context.ts by template

**You're good to go if you'd like to use raw D1 query.**

4. `npm install prisma --save-dev` `npx prisma init`
5. `npm install @prisma/adapter-d1`
6. `npm create cloudflare@latest` with Hello World example/Hello World Worker/TypeScript

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
