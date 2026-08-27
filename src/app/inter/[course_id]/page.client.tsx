"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getCourses, getDocuments } from "@/lib/sheets";
import DocumentCard from "@/components/DocumentCard";

export default function InterCoursePageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.course_id as string;

  const [course, setCourse] = useState<any>(null);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedTypes = searchParams.getAll("type");
  const selectedYears = searchParams.getAll("year");
  const selectedTerms = searchParams.getAll("term");

  useEffect(() => {
    Promise.all([getCourses(), getDocuments()])
      .then(([courses, docs]) => {
        const foundCourse = courses.find(
          (c) => c.course_id === courseId && c.program?.toLowerCase().trim() === "inter"
        );
        setCourse(foundCourse);

        const courseDocs = docs.filter((d) => d.course_id === courseId);
        setAllDocuments(courseDocs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, [courseId]);

  // Apply filters from URL
  const documents = useMemo(() => {
    let result = allDocuments;

    console.log("🔍 Course detail filters (Inter):");
    console.log("  selectedTypes:", selectedTypes);
    console.log("  selectedYears:", selectedYears);
    console.log("  selectedTerms:", selectedTerms);
    console.log("  allDocuments:", allDocuments.length);

    if (selectedTypes.length > 0) {
      const normalizedTypes = selectedTypes.map((t) => t.trim().toLowerCase());
      console.log("  normalizedTypes:", normalizedTypes);
      console.log("  sample allDocuments types:", allDocuments.slice(0, 3).map(d => d.type));
      result = result.filter((d) =>
        normalizedTypes.includes((d.type || "").trim().toLowerCase())
      );
      console.log("  after type filter:", result.length);
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

    console.log("  final documents:", result.length);
    return result;
  }, [allDocuments, selectedTypes, selectedYears, selectedTerms]);

  if (loading) {
    return <div className="flex-1 p-8">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="p-4 md:p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-red-700 hover:text-red-800 font-medium text-sm flex items-center gap-2"
        >
          ← Back
        </button>

        <h1 className="font-sans font-bold text-2xl md:text-3xl text-gray-900 mb-8">
          {course.name_en || course.name_th || "Unknown Course"}
        </h1>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No documents for this course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {documents.map((doc, index) => (
              <DocumentCard
                key={`${courseId}-${doc.doc_id}-${index}`}
                document={doc}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
