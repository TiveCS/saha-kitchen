import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Index() {
  const session = await auth();

  if (!session) return redirect("/login");

  return redirect("/analytics");
}
