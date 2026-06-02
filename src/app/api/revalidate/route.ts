import { getCourses, getDocuments, getBooks } from "@/lib/sheets";

export async function GET(request: Request) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return new Response(JSON.stringify({ error: "Not available in production" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("🔄 Revalidating cache...");

    // Force fetch fresh data from Google Sheets
    const [courses, documents, books] = await Promise.all([
      getCourses(),
      getDocuments(),
      getBooks(),
    ]);

    console.log("✅ Cache revalidated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cache cleared and data revalidated",
        data: {
          courses: courses.length,
          documents: documents.length,
          books: books.length,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Revalidation error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
