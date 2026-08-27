"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { getCourses, getDocuments } from "@/lib/sheets";
import { Category } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";

export default function ThaiPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 ThaiPageContent: Loading data...");
    Promise.all([getCourses(), getDocuments()])
      .then(([c, d]) => {
        console.log("✓ Data loaded successfully");
        console.log("  Courses:", c.length);
        console.log("  Documents:", d.length);
        setCourses(c);
        setDocuments(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const program = "thai" as const;
  const selectedCategory = (searchParams.get("category") || "all") as Category;
  const selectedTypes = searchParams.getAll("type");
  const selectedYears = searchParams.getAll("year");
  const selectedTerms = searchParams.getAll("term");

  const programCourses = useMemo(
    () =>
      courses
        .filter((c) => c.program?.toLowerCase().trim() === program)
        .filter((c) => c.name_th && c.name_th.trim()),
    [courses]
  );

  const programDocuments = useMemo(
    () =>
      documents.filter((d) =>
        programCourses.some((c) => c.course_id === d.course_id)
      ),
    [documents, programCourses]
  );

  // Filter documents first
  let filteredDocuments = useMemo(() => {
    let result = programDocuments;

    console.log("🔍 Thai filteredDocuments useMemo:");
    console.log("  selectedTypes:", selectedTypes);
    console.log("  sample d.type:", programDocuments[0]?.type);
    console.log("  filtered count so far:", result.length);

    if (selectedCategory !== "all") {
      const categoryCoursesIds = programCourses
        .filter((c) => c.category === selectedCategory)
        .map((c) => c.course_id);
      result = result.filter((d) =>
        categoryCoursesIds.includes(d.course_id)
      );
    }

    if (selectedTypes.length > 0) {
      const normalizedTypes = selectedTypes.map((t) => t.trim().toLowerCase());
      result = result.filter((d) =>
        normalizedTypes.includes((d.type || "").trim().toLowerCase())
      );
    }

    if (selectedYears.length > 0) {
      result = result.filter((d) =>
        selectedYears.includes(d.year.toString())
      );
    }

    if (selectedTerms.length > 0) {
      result = result.filter((d) =>
        selectedTerms.includes(d.term.toString())
      );
    }

    console.log("  filtered count:", result.length);
    return result;
  }, [
    programDocuments,
    programCourses,
    selectedCategory,
    selectedTypes,
    selectedYears,
    selectedTerms,
  ]);

  // Get courses that have at least one filtered document
  const coursesWithFilteredDocs = useMemo(() => {
    const courseIds = new Set(filteredDocuments.map((d) => d.course_id));
    console.log("  coursesWithFilteredDocs calculation:");
    console.log("    courseIds from filteredDocuments:", Array.from(courseIds));
    const result = programCourses.filter((c) => courseIds.has(c.course_id));
    console.log("    resulting courses:", result.map(c => c.course_id));
    return result;
  }, [filteredDocuments, programCourses]);

  const searchableCourses = useMemo(() => {
    return programCourses.map((course) => {
      const courseDocuments = programDocuments.filter(
        (d) => d.course_id === course.course_id
      );
      const documentTitles = courseDocuments
        .map((d) => d.title)
        .join(" ");

      return {
        ...course,
        searchText: `${course.name_th} ${course.name_en} ${course.category_th} ${course.category_en} ${documentTitles}`,
      };
    });
  }, [programCourses, programDocuments]);

  const fuse = useMemo(() => {
    return new Fuse(searchableCourses, {
      keys: ["name_th", "name_en", "category_th", "category_en", "searchText"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [searchableCourses]);

  const searchResults = useMemo(() => {
    const baseResults = searchQuery.trim()
      ? fuse.search(searchQuery).map((result) => result.item)
      : coursesWithFilteredDocs;

    return baseResults;
  }, [searchQuery, fuse, coursesWithFilteredDocs]);

  // Log courses data for debugging
  console.log("📊 Courses data received:", {
    count: programCourses.length,
    courses: programCourses.map((c) => ({
      course_id: c.course_id,
      name_th: c.name_th,
      category: c.category,
      category_th: c.category_th,
      category_en: c.category_en,
    })),
    uniqueCategories: [
      ...new Set(programCourses.map((c) => c.category_th).filter(Boolean)),
    ],
  });

  // Build documentCounts dynamically from all unique categories in data
  const documentCounts: Record<string, number> = { all: programDocuments.length };
  const uniqueCategoriesInData = Array.from(
    new Set(programCourses.map((c) => c.category).filter(Boolean))
  );
  uniqueCategoriesInData.forEach((category) => {
    documentCounts[category] = programDocuments.filter(
      (d) =>
        programCourses.find(
          (c) => c.course_id === d.course_id && c.category === category
        ) !== undefined
    ).length;
  });

  console.log("📈 Document counts:", documentCounts);

  if (loading) {
    return <div className="flex-1 p-8">Loading...</div>;
  }

  console.log("🎬 Thai page render:");
  console.log("  filteredDocuments:", filteredDocuments.length);
  console.log("  coursesWithFilteredDocs:", coursesWithFilteredDocs.length);
  console.log("  searchResults:", searchResults.length);
  console.log("  searchResults sample:", searchResults.slice(0, 2).map(c => ({ course_id: c.course_id, name_th: c.name_th })));

  return (
    <div className="flex flex-1">
      <Sidebar program={program} documentCounts={documentCounts} courses={programCourses} />

      <main className="flex-1 p-4 md:p-8">
        <SearchBar onSearch={setSearchQuery} />

        {selectedTypes.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            {selectedTypes.map((type) => (
              <span
                key={type}
                className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-10">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบผลลัพธ์ที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            Array.from(
              new Set(searchResults.map((c) => c.category))
            )
              .sort()
              .map((category) => {
                const categoryCourses = searchResults.filter(
                  (c) => c.category === category
                );

                // Get category label from courses data
                const courseInCategory = programCourses.find(
                  (c) => c.category === category
                );
                const categoryLabel = courseInCategory?.category_th || category;

                return (
                  <div key={category}>
                    <h1 className="font-sans font-bold text-2xl text-gray-900 mb-6">
                      {categoryLabel}
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {categoryCourses.map((course) => {
                        const courseDocCount = filteredDocuments.filter(
                          (d) => d.course_id === course.course_id
                        ).length;
                        return (
                          <button
                            key={course.course_id}
                            onClick={() => {
                              const params = new URLSearchParams();
                              selectedTypes.forEach(t => params.append('type', t));
                              selectedYears.forEach(y => params.append('year', y));
                              selectedTerms.forEach(t => params.append('term', t));
                              const queryString = params.toString();
                              router.push(`/thai/${course.course_id}${queryString ? '?' + queryString : ''}`);
                            }}
                            className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow hover:border-red-700 text-left"
                          >
                            <h3 className="font-sans font-semibold text-lg text-gray-900 mb-3">
                              {course.name_th || course.name_en || "Unknown Course"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {courseDocCount} {courseDocCount === 1 ? "ไฟล์" : "ไฟล์"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ไม่พบเอกสารตรงกับเงื่อนไข</p>
          </div>
        )}
      </main>
    </div>
  );
}
