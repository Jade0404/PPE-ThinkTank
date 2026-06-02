"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Category, DocumentType, Course } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface SidebarProps {
  program: "thai" | "inter";
  documentCounts: Record<Category, number>;
  courses: Course[];
}

const typeLabelsMap = {
  th: {
    sheet: "ชีทเรียน",
    summary: "สรุป",
    exam: "ข้อสอบเก่า",
  },
  en: {
    sheet: "Sheets",
    summary: "Summaries",
    exam: "Past Exams",
  },
};

const categoryLabelsMap = {
  th: {
    economics: "เศรษฐศาสตร์",
    politics: "รัฐศาสตร์",
    law: "นิติศาสตร์",
  },
  en: {
    economics: "Economics",
    politics: "Politics",
    law: "Law",
  },
};

function FilterContent({
  program,
  searchParams,
  displayLang,
  typeLabels,
  categoryLabels,
  uniqueCategories,
  documentCounts,
  selectedCategory,
  selectedTypes,
  selectedYears,
  selectedTerms,
  updateParams,
  getCategoryLabel,
  getSectionTitle,
}: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif font-semibold text-gray-900 mb-4">
          {getSectionTitle("category")}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParams("category", "all")}
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
              onClick={() => updateParams("category", category)}
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

      <Separator />

      <div>
        <h3 className="font-serif font-semibold text-gray-900 mb-4">
          {getSectionTitle("type")}
        </h3>
        <div className="space-y-2">
          {(["sheet", "summary", "exam"] as DocumentType[]).map((type) => (
            <button
              key={type}
              onClick={() => updateParams("type", type, true)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                selectedTypes.includes(type)
                  ? "bg-red-50 text-red-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                readOnly
                className="mr-2 w-4 h-4"
              />
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-serif font-semibold text-gray-900 mb-4">
          {getSectionTitle("year")}
        </h3>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((year) => (
            <button
              key={`year-${year}`}
              onClick={() => updateParams("year", year.toString(), true)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                selectedYears.includes(year.toString())
                  ? "bg-red-50 text-red-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedYears.includes(year.toString())}
                readOnly
                className="mr-2 w-4 h-4"
              />
              {displayLang === "en" ? `Year ${year}` : `ปี ${year}`}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-serif font-semibold text-gray-900 mb-4">
          {getSectionTitle("term")}
        </h3>
        <div className="space-y-2">
          {[1, 2].map((term) => (
            <button
              key={`term-${term}`}
              onClick={() => updateParams("term", term.toString(), true)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                selectedTerms.includes(term.toString())
                  ? "bg-red-50 text-red-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTerms.includes(term.toString())}
                readOnly
                className="mr-2 w-4 h-4"
              />
              {displayLang === "en" ? `Term ${term}` : `เทอม ${term}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  program,
  documentCounts,
  courses,
}: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);

  // For inter program, always use English; for thai, use the language setting
  const displayLang = program === "inter" ? "en" : (language as "th" | "en");

  const selectedCategory = (searchParams.get("category") || "all") as Category;
  const selectedTypes = searchParams.getAll("type");
  const selectedYears = searchParams.getAll("year");
  const selectedTerms = searchParams.getAll("term");

  const typeLabels = typeLabelsMap[displayLang];
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
        type: "ประเภทไฟล์",
        year: "ปีการศึกษา",
        term: "เทอม",
        all: "ทั้งหมด",
      },
      en: {
        category: "Category",
        type: "File Type",
        year: "Academic Year",
        term: "Term",
        all: "All",
      },
    };
    return titles[displayLang][key as keyof typeof titles.th] || key;
  };

  const updateParams = (
    paramName: string,
    value: string,
    isMulti: boolean = false
  ) => {
    const params = new URLSearchParams(searchParams);

    if (isMulti) {
      const values = params.getAll(paramName);
      if (values.includes(value)) {
        params.delete(paramName);
        values
          .filter((v) => v !== value)
          .forEach((v) => params.append(paramName, v));
      } else {
        params.append(paramName, value);
      }
    } else {
      params.set(paramName, value);
    }

    router.push(`/${program}?${params.toString()}`);
  };

  return (
    <>
      <aside className="hidden md:block w-48 bg-white p-6 border-r border-gray-200">
        <FilterContent
          program={program}
          searchParams={searchParams}
          displayLang={displayLang}
          typeLabels={typeLabels}
          categoryLabels={categoryLabels}
          uniqueCategories={uniqueCategories}
          documentCounts={documentCounts}
          selectedCategory={selectedCategory}
          selectedTypes={selectedTypes}
          selectedYears={selectedYears}
          selectedTerms={selectedTerms}
          updateParams={updateParams}
          getCategoryLabel={getCategoryLabel}
          getSectionTitle={getSectionTitle}
        />
      </aside>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <button
          onClick={() => setSheetOpen(true)}
          className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          🔍 {displayLang === "en" ? "Filters" : "ตัวกรอง"}
        </button>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {displayLang === "en" ? "Filters" : "ตัวกรอง"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 pr-4">
            <FilterContent
              program={program}
              searchParams={searchParams}
              displayLang={displayLang}
              typeLabels={typeLabels}
              categoryLabels={categoryLabels}
              uniqueCategories={uniqueCategories}
              documentCounts={documentCounts}
              selectedCategory={selectedCategory}
              selectedTypes={selectedTypes}
              selectedYears={selectedYears}
              selectedTerms={selectedTerms}
              updateParams={updateParams}
              getCategoryLabel={getCategoryLabel}
              getSectionTitle={getSectionTitle}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
