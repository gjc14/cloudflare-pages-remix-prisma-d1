import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Cloudflare Remix Prisma D1" },
    {
      name: "description",
      content:
        "Connecting D1 with Prisma on Remix! Hosting on Cloudflare Pages",
    },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;

  try {
    let { results } = await env.DB.prepare("SELECT * FROM user LIMIT 5").all();

    return json({ results });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
};

export default function Index() {
  const { results } = useLoaderData<typeof loader>();
  console.log(results);

  return (
    <main className="m-8 space-y-5">
      <h1 className="text-2xl font-bold">Remix + Prisma + Cloudflare D1</h1>

      <p>
        Result of{" "}
        <code className="text-sm bg-amber-300 px-1">
          await env.DB.prepare('SELECT * FROM user LIMIT 5').all()
        </code>{" "}
        in loader
      </p>

      <p className="px-3 py-2 bg-gray-200 rounded-[8px]">
        {JSON.stringify(results)}
      </p>

      <div>
        <Link to="users" className="font-semibold hover:underline">
          {">"} Checkout Users Query with Prisma
        </Link>
      </div>
    </main>
  );
}
