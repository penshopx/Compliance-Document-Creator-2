const sourcePageMarker = /^\s*---\s*Halaman\s+(\d+)\s*---\s*$/gim;

export function extractDocumentPageNumbers(content: string): number[] {
  const pages = new Set<number>();
  for (const match of content.matchAll(sourcePageMarker)) {
    const pageNumber = Number(match[1]);
    if (Number.isSafeInteger(pageNumber) && pageNumber > 0) pages.add(pageNumber);
  }
  return [...pages].sort((left, right) => left - right);
}

export function sanitizeFindingPageNumbers(
  candidatePageNumbers: readonly number[] | undefined,
  sourcePageNumbers: readonly number[],
): number[] {
  const availablePages = new Set(sourcePageNumbers);
  return [...new Set(candidatePageNumbers ?? [])]
    .filter((pageNumber) => Number.isSafeInteger(pageNumber) && availablePages.has(pageNumber))
    .sort((left, right) => left - right);
}
