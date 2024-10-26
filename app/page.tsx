import { authOptions } from "@/auth";
import SignOutButton from "@/components/signout-button";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const session: { user?: { role?: string } } | null = await getServerSession(
    authOptions
  );

  return (
    <div>
      {session?.user?.role && <p>{session.user.role}</p>}
      <SignOutButton />
    </div>
  );
}
