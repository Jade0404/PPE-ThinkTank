import { Suspense } from "react";
import InterPageContent from "./page.client";

export default function InterPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8">Loading...</div>}>
      <InterPageContent />
    </Suspense>
  );
}
