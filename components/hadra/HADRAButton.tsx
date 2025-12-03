"use client";

import { Button } from "../ui/button";

export default function HADRAButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      onClick={onOpen}
      className="fixed bottom-6 right-6 px-6 py-3 text-lg shadow-lg bg-indigo-600 hover:bg-indigo-500"
    >
      Open HADRA-01
    </Button>
  );
}
