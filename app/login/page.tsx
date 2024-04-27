import { getHasUser } from "@/actions/users.action";
import { NewUserForm } from "@/components/NewUserForm";
import { SignInForm } from "@/components/SignInForm";

export default async function LoginPage() {
  const hasUser = await getHasUser();

  return (
    <section className="flex-1 ">
      <div className="max-w-sm mx-auto mt-32">
        {hasUser ? <SignInForm /> : <NewUserForm />}
      </div>
    </section>
  );
}
