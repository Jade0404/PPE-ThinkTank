"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isThaiActive =
    pathname === "/thai" || pathname.startsWith("/thai/");
  const isInterActive =
    pathname === "/inter" || pathname.startsWith("/inter/");

  const isDocumentsPage = !pathname.includes("/books");
  const isBooksPage = pathname.includes("/books");

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>
              PPE Think Tank
            </h1>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
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

          <div className="hidden md:flex gap-8 items-center">
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

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="block md:hidden p-2 text-gray-900"
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-4">
            <Link
              href="/thai"
              className={`block px-3 py-2 text-sm font-medium transition-colors rounded ${
                isThaiActive
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ภาคภาษาไทย
            </Link>
            <Link
              href="/inter"
              className={`block px-3 py-2 text-sm font-medium transition-colors rounded ${
                isInterActive
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              International Program
            </Link>
            <hr className="my-2" />
            <Link
              href={isThaiActive ? "/thai" : "/inter"}
              className={`block px-3 py-2 text-sm font-medium transition-colors rounded ${
                isDocumentsPage
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {language === "th" ? "เอกสาร" : "Documents"}
            </Link>
            <Link
              href={isThaiActive ? "/thai/books" : "/inter/books"}
              className={`block px-3 py-2 text-sm font-medium transition-colors rounded ${
                isBooksPage
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {language === "th" ? "หนังสือ" : "Books"}
            </Link>
            <hr className="my-2" />
            <div className="flex gap-2 px-3">
              <button
                onClick={() => setLanguage("th")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  language === "th"
                    ? "bg-red-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ไทย
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  language === "en"
                    ? "bg-red-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
