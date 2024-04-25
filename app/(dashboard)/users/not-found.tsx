import { Link, Button } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="flex-1 px-8 py-8 flex flex-col items-center justify-center gap-y-4">
      <h2 className="text-lg font-medium">Oops! Data user tidak ditemukan!</h2>
      <Button as={Link} href="/users" color="primary">
        Kembali ke Manajemen User
      </Button>
    </div>
  );
}
