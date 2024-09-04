import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getUsers } from "~/db/user.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;

  const users = await getUsers(env.DB);
  return json({ users });
};

export default function User() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Users</h1>
      <p>Result: {JSON.stringify(users)}</p>
    </main>
  );
}
