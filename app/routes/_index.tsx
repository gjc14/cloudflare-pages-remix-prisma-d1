import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

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
    <main>
      <h1>Remix + Prisma + Cloudflare D1</h1>
    </main>
  );
}
