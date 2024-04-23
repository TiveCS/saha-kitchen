import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div
      id="loading-wrapper"
      className="flex-1 flex items-center justify-center"
    >
      <Spinner label="Memuat..." />
    </div>
  );
}
