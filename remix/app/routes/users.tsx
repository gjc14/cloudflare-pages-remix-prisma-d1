import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getUsers } from "~/db/user.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;

  const users = await getUsers(env.DB);
  return json({ users });
};

export default function User() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <main className="m-8 space-y-5">
      <h1 className="text-2xl font-bold">Users</h1>

      <p>
        Result of{" "}
        <code className="text-sm bg-amber-300 px-1">
          await prisma.user.findMany();
        </code>{" "}
        in loader:{" "}
      </p>

      <p className="px-3 py-2 bg-gray-200 rounded-[8px]">
        {JSON.stringify(users)}
      </p>

      <div>
        <Link to="/" className="font-semibold hover:underline">
          {">"} Back home
        </Link>
      </div>
    </main>
  );
}
