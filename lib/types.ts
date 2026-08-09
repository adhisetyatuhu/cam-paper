export type DocumentRecord = {
  id: string;
  name: string;
  pdfUri: string;
  /** Per-page source images, in order. Absent on documents saved before the page editor existed. */
  pageUris?: string[];
  pageCount: number;
  createdAt: number;
};
