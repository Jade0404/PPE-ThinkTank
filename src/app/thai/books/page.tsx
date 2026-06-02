import { Suspense } from "react";
import ThaiBooksPageContent from "./page.client";

export default function ThaiBooksPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8">Loading...</div>}>
      <ThaiBooksPageContent />
    </Suspense>
  );
}
