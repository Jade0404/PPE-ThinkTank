import { Suspense } from "react";
import ThaiPageContent from "./page.client";

export default function ThaiPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8">Loading...</div>}>
      <ThaiPageContent />
    </Suspense>
  );
}
