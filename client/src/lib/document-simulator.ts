export type DocumentReviewStandard = "smap" | "pancek";
export type DocumentSourceType = "saved" | "pasted";

export type EditableDocument = {
  title: string;
  content: string;
};

type SavedDocumentReference = {
  id: string;
  title: string;
};

export function createEditableDocument(title: string, content: string): EditableDocument {
  return { title, content };
}

export function isPastedDocumentReady(content: string, maxLength: number): boolean {
  return Boolean(content.trim()) && content.length <= maxLength;
}

export function buildDocumentReviewPayload(input: {
  standard: DocumentReviewStandard;
  sourceType: DocumentSourceType;
  selectedDocument?: SavedDocumentReference;
  pastedDocument: EditableDocument;
}) {
  if (input.sourceType === "saved") {
    if (!input.selectedDocument) {
      throw new Error("Pilih dokumen tersimpan sebelum menjalankan review.");
    }
    return {
      standard: input.standard,
      sourceType: input.sourceType,
      sourceId: input.selectedDocument.id,
      sourceTitle: input.selectedDocument.title,
    };
  }

  return {
    standard: input.standard,
    sourceType: input.sourceType,
    sourceTitle: input.pastedDocument.title.trim() || "Teks yang ditempel",
    content: input.pastedDocument.content.trim(),
  };
}
