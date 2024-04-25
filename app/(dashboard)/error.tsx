"use client";

import { Button, Link } from "@nextui-org/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 px-8 py-8 flex flex-col items-center justify-center gap-y-4">
      <h2 className="text-xl font-medium">Terjadi kesalahan!</h2>
      <p className="text-lg">{error.message}</p>

      <div className="flex flex-row gap-x-6">
        <Button as={Link} href="/analytics" color="primary">
          Kembali ke Dashboard
        </Button>

        <Button onClick={reset} variant="flat">
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
