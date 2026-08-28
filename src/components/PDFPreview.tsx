"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PDFPreviewProps {
  driveId: string;
  title: string;
  onClose: () => void;
}

export default function PDFPreview({
  driveId,
  title,
  onClose,
}: PDFPreviewProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-[95%] h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-sans font-semibold text-gray-900 truncate">
            {title}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            className="w-full h-full border-0"
            title={title}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
