"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Document, Course, Program } from "@/lib/types";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import DocumentCard from "./DocumentCard";

interface DocumentsPageProps {
  program: Program;
  courses: Course[];
  documents: Document[];
  initialCategory?: string;
  initialTypes?: string[];
  initialYears?: string[];
  initialTerms?: string[];
}

export default function DocumentsPage({
  program,
  courses: allCourses,
  documents: allDocuments,
}: DocumentsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const programCourses = useMemo(
    () => allCourses.filter((c) => c.program === program),
    [program, allCourses]
  );

  const programDocuments = useMemo(
    () =>
      allDocuments.filter((d) =>
        programCourses.some((c) => c.course_id === d.course_id)
      ),
    [allDocuments, programCourses]
  );

  const fuse = useMemo(() => {
    return new Fuse(programDocuments, {
      keys: ["title", "course_id"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [programDocuments]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return programDocuments;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse, programDocuments]);

  const documentCounts = {
    all: programDocuments.length,
    economics: programDocuments.filter(
      (d) =>
        programCourses.find(
          (c) => c.course_id === d.course_id && c.category === "economics"
        ) !== undefined
    ).length,
    politics: programDocuments.filter(
      (d) =>
        programCourses.find(
          (c) => c.course_id === d.course_id && c.category === "politics"
        ) !== undefined
    ).length,
    law: programDocuments.filter(
      (d) =>
        programCourses.find(
          (c) => c.course_id === d.course_id && c.category === "law"
        ) !== undefined
    ).length,
    philosophy: programDocuments.filter(
      (d) =>
        programCourses.find(
          (c) => c.course_id === d.course_id && c.category === "philosophy"
        ) !== undefined
    ).length,
  };

  return (
    <div className="flex flex-1">
      <Sidebar
        program={program}
        documentCounts={documentCounts}
        courses={programCourses}
      />

      <main className="flex-1 p-8">
        <SearchBar onSearch={setSearchQuery} />

        <div className="grid grid-cols-2 gap-6">
          {searchResults.map((doc) => {
            const course = programCourses.find(
              (c) => c.course_id === doc.course_id
            );
            return (
              <DocumentCard
                key={doc.doc_id}
                document={doc}
                course={course}
              />
            );
          })}
        </div>

        {searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {program === "thai"
                ? "ไม่พบเอกสารตรงกับเงื่อนไข"
                : "No documents found"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
