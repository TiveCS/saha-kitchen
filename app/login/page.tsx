import { getHasUser } from "@/actions/users.action";
import { NewUserForm } from "@/components/NewUserForm";
import { SignInForm } from "@/components/SignInForm";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

export default async function LoginPage() {
  const hasUser = await getHasUser();

  return (
    <section className="flex-1 bg-orange-50 dark:bg-background">
      <div className="grid grid-cols-5 min-h-screen max-w-6xl gap-x-16 mx-auto items-center justify-center">
        <div className="col-span-3 flex justify-center items-center">
          <Image
            as={NextImage}
            src="/logo.png"
            alt="Saha Kitchen"
            width={340}
            height={113}
          />
        </div>

        <div className="col-span-2 sticky top-1/3">
          {hasUser ? <SignInForm /> : <NewUserForm />}
        </div>
      </div>
    </section>
  );
}
