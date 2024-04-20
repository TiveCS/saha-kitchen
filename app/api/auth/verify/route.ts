import { signInAction } from "@/actions/auth.action";
import { SignInSchema } from "@/schemas/auth.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const validated = SignInSchema.safeParse(payload);

  if (!validated.success) {
    return NextResponse.json(
      {
        message: "Data tidak valid",
        error: validated.error.flatten(),
      },
      { status: 400 }
    );
  }

  try {
    const user = await signInAction(validated.data);

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
