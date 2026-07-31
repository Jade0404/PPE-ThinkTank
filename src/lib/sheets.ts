import Papa from "papaparse";
import { Course, Document, Book } from "./types";

const SHEET_ID = "2PACX-1vQ1LczIUxRjYwnY-og0EZs0e3GU41K2zyYObG3cyHtVtkADq2BLArpSpTO-2nQhjroNE23m_fvXTpZN";

function getSheetUrl(gid: number): string {
  return `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
}

async function fetchCSV<T>(url: string): Promise<T[]> {
  console.log("🔄 Fetching CSV from:", url);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const error = `Failed to fetch sheet: ${response.statusText} (Status: ${response.status})`;
      console.error("❌", error);
      throw new Error(error);
    }

    const csv = await response.text();
    console.log("✓ CSV fetched successfully, length:", csv.length);

    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("✓ CSV parsed successfully, rows:", results.data.length);
          if (results.data.length > 0) {
            console.log("📋 First row:", results.data[0]);
          }
          resolve(results.data as T[]);
        },
        error: (error: Error) => {
          console.error("❌ CSV parse error:", error.message);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}

export async function getCourses(): Promise<Course[]> {
  console.log("📚 getCourses() called");
  try {
    const courses = await fetchCSV<any>(getSheetUrl(0));
    console.log("Raw CSV rows:", courses.length);
    if (courses.length > 0) {
      console.log("Sample raw row:", courses[0]);
    }

    const mapped = courses
      .filter((row) => row.course_id && row.course_id.trim()) // Remove empty rows
      .map((row) => {
        // Map program: Check "Thai" or "program" column
        let program: "thai" | "inter" = "thai";
        const progValue = (row.program || row.Thai || "thai").toLowerCase().trim();
        if (progValue === "inter" || progValue === "international") {
          program = "inter";
        }

        // Map category: derive slug from category_en (e.g., "Globalization" -> "globalization")
        const catEn = (row.category_en || "").trim();
        const category = catEn
          ? catEn.toLowerCase().replace(/\s+/g, "-")
          : "economics";

        const course = {
          course_id: row.course_id,
          name_th: row.name_th || "",
          name_en: row.name_en || "",
          program,
          category,
          category_th: row.category_th || "",
          category_en: row.category_en || "",
        };
        return course;
      });

    console.log("✓ Courses mapped:", mapped.length, "courses");
    if (mapped.length > 0) {
      console.log("✓ First course:", mapped[0]);
      console.log("✓ Categories in data:", [
        ...new Set(mapped.map((c) => c.category_th).filter(Boolean)),
      ]);
    }

    // Debug: Log PD104_INT data
    const pd104 = mapped.find((c) => c.course_id === "PD104_INT");
    if (pd104) {
      console.log("🔍 PD104_INT mapping:");
      console.log("  category:", pd104.category);
      console.log("  category_th:", pd104.category_th);
      console.log("  category_en:", pd104.category_en);
    }

    return mapped;
  } catch (error) {
    console.error("❌ Error loading courses:", error);
    throw error;
  }
}

export async function getDocuments(): Promise<Document[]> {
  console.log("📄 getDocuments() called");
  try {
    const documents = await fetchCSV<any>(getSheetUrl(1008534431));

    if (documents.length > 0) {
      console.log("📋 CSV Headers:", Object.keys(documents[0]));
      console.log("📋 First row raw data:", documents[0]);
    }

    console.log("Raw documents before filtering:", documents.length);

    const mapped = documents
      .filter((row) => {
        const hasDocId = row.doc_id && row.doc_id.trim();
        if (!hasDocId) {
          console.log("  Filtered out row with empty doc_id:", row);
        }
        return hasDocId;
      })
      .map((row) => ({
        doc_id: row.doc_id,
        course_id: row.course_id,
        type: row.type as "sheet" | "summary" | "exam",
        year: parseInt(row.year, 10) as 1 | 2 | 3 | 4,
        term: parseInt(row.term, 10) as 1 | 2,
        title: row.title,
        drive_id: row.drive_id,
      }));
    console.log("✓ Documents loaded:", mapped.length, "documents");
    console.log("  All documents:", mapped);
    return mapped;
  } catch (error) {
    console.error("❌ Error loading documents:", error);
    throw error;
  }
}

export async function getBooks(): Promise<Book[]> {
  console.log("📖 getBooks() called");
  try {
    const books = await fetchCSV<any>(getSheetUrl(2132058457));
    const mapped = books.map((row) => ({
      course_id: row.course_id,
      title: row.title,
      author: row.author,
      type: row.type,
      borrow: row.borrow === "true" || row.borrow === "TRUE",
    }));
    console.log("✓ Books loaded:", mapped.length, "books");
    if (mapped.length > 0) {
      console.log("  Sample book:", mapped[0]);
    }
    return mapped;
  } catch (error) {
    console.error("❌ Error loading books:", error);
    throw error;
  }
}
