import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;

  const hi = await env.USER_SERVICE.hi();
  return json({ hi });
};

export default function User() {
  const { hi } = useLoaderData<typeof loader>();
  return (
    <main className="m-8 space-y-5">
      <h1 className="text-2xl font-bold">
        Response from prisma-worker via RPC
      </h1>

      <p>
        Result of{" "}
        <code className="text-sm bg-amber-300 px-1">
          await env.USER_SERVICE.hi();
        </code>{" "}
        in loader:{" "}
      </p>

      <p className="px-3 py-2 bg-gray-200 rounded-[8px]">
        {JSON.stringify(hi)}
      </p>

      <div>
        <Link to="/users" className="font-semibold hover:underline">
          {">"} Checkout Users Query to Prisma-Worker via RPC
        </Link>
      </div>

      <div>
        <Link to="/" className="font-semibold hover:underline">
          {">"} Back home
        </Link>
      </div>
    </main>
  );
}
