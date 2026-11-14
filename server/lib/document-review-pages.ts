const sourcePageMarker = /^\s*---\s*Halaman\s+(\d+)\s*---\s*$/gim;

export function extractDocumentPageNumbers(content: string): number[] {
  const pages = new Set<number>();
  const marker = new RegExp(sourcePageMarker.source, sourcePageMarker.flags);
  let match: RegExpExecArray | null;
  while ((match = marker.exec(content)) !== null) {
    const pageNumber = Number(match[1]);
    if (Number.isSafeInteger(pageNumber) && pageNumber > 0) pages.add(pageNumber);
  }
  return Array.from(pages).sort((left, right) => left - right);
}

export function sanitizeFindingPageNumbers(
  candidatePageNumbers: readonly number[] | undefined,
  sourcePageNumbers: readonly number[],
): number[] {
  const availablePages = new Set(sourcePageNumbers);
  return Array.from(new Set(candidatePageNumbers ?? []))
    .filter((pageNumber) => Number.isSafeInteger(pageNumber) && availablePages.has(pageNumber))
    .sort((left, right) => left - right);
}
