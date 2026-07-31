"use client";

import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  courseName: string;
}

export default function BookCard({ book, courseName }: BookCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-1 h-10 rounded-full flex-shrink-0"
          style={{
            backgroundColor: book.borrow ? "#D97B1A" : "#C8391A",
          }}
        />
        {book.borrow && (
          <Badge variant="secondary" className="whitespace-nowrap text-xs">
            Borrow
          </Badge>
        )}
      </div>

      <p className="font-sans font-semibold text-gray-900 mb-1 line-clamp-2">
        {book.title}
      </p>
      <p className="text-sm text-gray-600 mb-3 line-clamp-1">{book.author}</p>
      <p className="text-xs text-gray-500">{courseName}</p>
    </div>
  );
}
