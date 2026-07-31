"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCourses, getBooks } from "@/lib/sheets";
import BooksSidebar from "@/components/BooksSidebar";
import BookCard from "@/components/BookCard";

export default function InterBooksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCourses(), getBooks()])
      .then(([c, b]) => {
        setCourses(c);
        setBooks(b);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const program = "inter" as const;
  const selectedCategory = (searchParams.get("category") || "all") as any;

  const programCourses = useMemo(
    () =>
      courses
        .filter((c) => c.program?.toLowerCase().trim() === program)
        .filter((c) => c.name_en && c.name_en.trim()),
    [courses]
  );

  const programBooks = useMemo(
    () =>
      books.filter((b) => programCourses.some((c) => c.course_id === b.course_id)),
    [books, programCourses]
  );

  const filteredBooks = useMemo(() => {
    let result = programBooks;

    if (selectedCategory !== "all") {
      const categoryCoursesIds = programCourses
        .filter((c) => c.category === selectedCategory)
        .map((c) => c.course_id);
      result = result.filter((b) => categoryCoursesIds.includes(b.course_id));
    }

    return result;
  }, [programBooks, programCourses, selectedCategory]);

  // Build documentCounts dynamically from all unique categories in data
  const documentCounts: Record<string, number> = { all: programBooks.length };
  const uniqueCategoriesInData = Array.from(
    new Set(programCourses.map((c) => c.category).filter(Boolean))
  );
  uniqueCategoriesInData.forEach((category) => {
    documentCounts[category] = programBooks.filter(
      (b) =>
        programCourses.find(
          (c) => c.course_id === b.course_id && c.category === category
        ) !== undefined
    ).length;
  });

  if (loading) {
    return <div className="flex-1 p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-1">
      <BooksSidebar program={program} documentCounts={documentCounts} courses={programCourses} />

      <main className="flex-1 p-4 md:p-8">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Recommended Books
        </h1>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No books in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredBooks.map((book: any) => {
              const course = programCourses.find((c) => c.course_id === book.course_id);
              return (
                <BookCard
                  key={`${book.course_id}-${book.title}`}
                  book={book}
                  courseName={course?.name_en || "Unknown Course"}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
