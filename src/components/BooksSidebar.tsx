"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Category, Course } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface BooksSidebarProps {
  program: "thai" | "inter";
  documentCounts: Record<Category, number>;
  courses: Course[];
}

const categoryLabelsMap = {
  th: {
    economics: "เศรษฐศาสตร์",
    politics: "รัฐศาสตร์",
    law: "นิติศาสตร์",
    philosophy: "ปรัชญา",
  },
  en: {
    economics: "Economics",
    politics: "Politics",
    law: "Law",
    philosophy: "Philosophy",
  },
};

export default function BooksSidebar({
  program,
  documentCounts,
  courses,
}: BooksSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);

  // For inter program, always use English; for thai, use the language setting
  const displayLang = program === "inter" ? "en" : (language as "th" | "en");

  const selectedCategory = (searchParams.get("category") || "all") as Category;
  const categoryLabels = categoryLabelsMap[displayLang];

  const uniqueCategories = Array.from(
    new Set(courses.map((c) => c.category))
  ).sort();

  const getCategoryLabel = (category: string): string => {
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const getSectionTitle = (key: string): string => {
    const titles = {
      th: {
        category: "หมวดวิชา",
        all: "ทั้งหมด",
      },
      en: {
        category: "Category",
        all: "All",
      },
    };
    return titles[displayLang][key as keyof typeof titles.th] || key;
  };

  const updateParams = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    router.push(`/${program}/books?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif font-semibold text-gray-900 mb-4">
          {getSectionTitle("category")}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParams("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === "all"
                ? "bg-red-50 text-red-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{getSectionTitle("all")}</span>
              <Badge variant="secondary" className="ml-2">
                {documentCounts.all}
              </Badge>
            </div>
          </button>
          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => updateParams(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-red-50 text-red-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{getCategoryLabel(category)}</span>
                <Badge variant="secondary" className="ml-2">
                  {documentCounts[category as Category] || 0}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-48 bg-white p-6 border-r border-gray-200">
        <FilterContent />
      </aside>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <button
          onClick={() => setSheetOpen(true)}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {displayLang === "en" ? "Filters" : "ตัวกรอง"}
        </button>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {displayLang === "en" ? "Filters" : "ตัวกรอง"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 pr-4">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
