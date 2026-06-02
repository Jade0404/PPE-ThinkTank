"use client";

import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/types";

interface BookRowProps {
  book: Book;
  courseName: string;
}

export default function BookRow({ book, courseName }: BookRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div
        className="w-1 h-12 rounded-full flex-shrink-0"
        style={{
          backgroundColor: book.borrow ? "#D97B1A" : "#C8391A",
        }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-gray-900 truncate">
          {book.title}
        </p>
        <p className="text-sm text-gray-600 truncate">{book.author}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {book.borrow && (
          <Badge variant="secondary" className="whitespace-nowrap">
            Borrow
          </Badge>
        )}
      </div>
    </div>
  );
}
