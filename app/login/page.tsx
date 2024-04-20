import { signUpAction } from "@/actions/auth.action";
import { SignInForm } from "@/components/SignInForm";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const handleRegister = async () => {
    "use server";

    await signUpAction({
      name: "Jamet",
      username: "jamet",
      password: "password",
      confirmPassword: "password",
      role: "ADMIN",
    });
  };

  const session = await auth();

  return (
    <>
      <p>{session?.user.name || "Unauthed"}</p>

      <SignInForm />

      <form action={handleRegister}>
        <button type="submit">Register</button>
      </form>
    </>
  );
}
