export interface Course {
  course_id: string;
  name_th: string;
  name_en: string;
  program: "thai" | "inter";
  category: "economics" | "politics" | "law" | "philosophy";
  category_th: string;
  category_en: string;
}

export interface Document {
  doc_id: string;
  course_id: string;
  type: "sheet" | "summary" | "exam";
  year: 1 | 2 | 3 | 4;
  term: 1 | 2;
  title: string;
  drive_id: string;
}

export interface Book {
  course_id: string;
  title: string;
  author: string;
  type: string;
  borrow: boolean;
}

export type Program = "thai" | "inter";
export type Category = "economics" | "politics" | "law" | "philosophy" | "all";
export type DocumentType = "sheet" | "summary" | "exam";
