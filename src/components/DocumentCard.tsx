"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Document, Course, DocumentType } from "@/lib/types";
import PDFPreview from "./PDFPreview";

interface DocumentCardProps {
  document: Document;
  course: Course | undefined;
}

const typeLabels: Record<DocumentType, string> = {
  sheet: "ชีทเรียน",
  summary: "สรุป",
  exam: "ข้อสอบเก่า",
};

const typeColors: Record<DocumentType, string> = {
  sheet: "bg-blue-100 text-blue-800",
  summary: "bg-green-100 text-green-800",
  exam: "bg-amber-100 text-amber-800",
};

export default function DocumentCard({
  document,
  course,
}: DocumentCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <Badge className={`${typeColors[document.type]}`}>
            {typeLabels[document.type]}
          </Badge>
          <span className="text-sm text-gray-500">
            ปี {document.year} เทอม {document.term}
          </span>
        </div>

        <h3 className="font-sans font-semibold text-gray-900 mb-2 line-clamp-2">
          {document.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          {course?.name_th || course?.name_en || "Unknown Course"}
        </p>

        {document.author && (
          <p className="text-sm text-gray-500 mb-3">
            โดย {document.author}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(true)}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Preview
          </Button>
          <a
            href={`https://drive.google.com/file/d/${document.drive_id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
          >
            Drive
          </a>
        </div>
      </div>

      {showPreview && (
        <PDFPreview
          driveId={document.drive_id}
          title={document.title}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
