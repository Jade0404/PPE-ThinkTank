import { Suspense } from "react";
import InterBooksPageContent from "./page.client";

export default function InterBooksPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8">Loading...</div>}>
      <InterBooksPageContent />
    </Suspense>
  );
}
