import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, User, AdapterUser } from "next-auth";

type StructUser = {
  id: number;
  name: string;
  username: string;
  role: UserRole;
};

declare module "next-auth" {
  interface User {
    user: StructUser;
  }

  interface Session extends DefaultSession {
    user: StructUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    user: StructUser;
  }
}
