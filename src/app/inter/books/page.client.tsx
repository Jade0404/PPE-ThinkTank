"use client";

import { useState, useEffect, useMemo } from "react";
import { getCourses, getBooks } from "@/lib/sheets";
import BookRow from "@/components/BookRow";

export default function InterBooksPageContent() {
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

  const programCourses = useMemo(
    () => courses.filter((c) => c.program === program),
    [courses]
  );

  const programBooks = useMemo(
    () =>
      books.filter((b) => programCourses.some((c) => c.course_id === b.course_id)),
    [books, programCourses]
  );

  const booksByCoursed = useMemo(
    () =>
      programCourses.map((course) => ({
        course,
        books: programBooks.filter((b) => b.course_id === course.course_id),
      })),
    [programCourses, programBooks]
  );

  if (loading) {
    return <div className="flex-1 p-8">Loading...</div>;
  }

  return (
    <main className="flex-1 p-8 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">
        Recommended Books
      </h1>

      <div className="space-y-8">
        {booksByCoursed.map(({ course, books: courseBooks }) => (
          courseBooks.length > 0 && (
            <div
              key={course.course_id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-serif font-semibold text-gray-900">
                  {course.name_en}
                </h2>
              </div>
              <div>
                {courseBooks.map((book: any) => (
                  <BookRow
                    key={`${course.course_id}-${book.title}`}
                    book={book}
                    courseName={course.name_en}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {programBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books available</p>
        </div>
      )}
    </main>
  );
}
