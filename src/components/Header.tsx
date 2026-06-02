"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const isThaiActive =
    pathname === "/thai" || pathname.startsWith("/thai/");
  const isInterActive =
    pathname === "/inter" || pathname.startsWith("/inter/");

  const isDocumentsPage = !pathname.includes("/books");
  const isBooksPage = pathname.includes("/books");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>
              PPE Think Tank
            </h1>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex gap-8">
              <Link
                href="/thai"
                className={`pb-3 text-sm font-medium transition-colors ${
                  isThaiActive
                    ? "text-gray-900 border-b-2 border-red-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ภาคภาษาไทย
              </Link>
              <Link
                href="/inter"
                className={`pb-3 text-sm font-medium transition-colors ${
                  isInterActive
                    ? "text-gray-900 border-b-2 border-red-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                International Program
              </Link>
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <Link
              href={isThaiActive ? "/thai" : "/inter"}
              className={`pb-3 text-sm font-medium transition-colors ${
                isDocumentsPage
                  ? "text-gray-900 border-b-2 border-red-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "th" ? "เอกสาร" : "Documents"}
            </Link>
            <Link
              href={isThaiActive ? "/thai/books" : "/inter/books"}
              className={`pb-3 text-sm font-medium transition-colors ${
                isBooksPage
                  ? "text-gray-900 border-b-2 border-red-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "th" ? "หนังสือ" : "Books"}
            </Link>

            <div className="flex gap-1 ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={() => setLanguage("th")}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === "th"
                    ? "bg-red-700 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ไทย
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === "en"
                    ? "bg-red-700 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
