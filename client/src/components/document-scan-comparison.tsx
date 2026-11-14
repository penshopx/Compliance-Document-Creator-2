import { useMemo, useState } from "react";
import { AlertCircle, FileText, ScanText, ShieldCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type ScanPage = {
  pageNumber: number;
};

type DocumentScanComparisonProps = {
  pages: ScanPage[];
  pdfUrl: string;
  title?: string;
  content: string;
  onContentChange: (content: string) => void;
  disabled?: boolean;
};

type PageTextRange = {
  start: number;
  end: number;
  text: string;
};

const pageMarkerPattern = /^--- Halaman (\d+) ---[ \t]*(?:\r?\n|$)/gm;

function getPageTextRange(content: string, pageNumber: number): PageTextRange | null {
  const markers = Array.from(content.matchAll(pageMarkerPattern));
  const selectedIndex = markers.findIndex((marker) => Number(marker[1]) === pageNumber);
  if (selectedIndex === -1) return null;

  const selectedMarker = markers[selectedIndex];
  const start = selectedMarker.index! + selectedMarker[0].length;
  const rawEnd = markers[selectedIndex + 1]?.index ?? content.length;
  const rawText = content.slice(start, rawEnd);
  const trailingSeparator = rawText.match(/(?:\r?\n[ \t]*)+$/)?.[0] ?? "";
  const end = rawEnd - trailingSeparator.length;

  return { start, end, text: content.slice(start, end) };
}

export function replaceScannedPageText(
  content: string,
  pageNumber: number,
  pageText: string,
): string | null {
  const range = getPageTextRange(content, pageNumber);
  if (!range) return null;
  return content.slice(0, range.start) + pageText + content.slice(range.end);
}

export function DocumentScanComparison({
  pages,
  pdfUrl,
  title,
  content,
  onContentChange,
  disabled = false,
}: DocumentScanComparisonProps) {
  const [requestedPageNumber, setRequestedPageNumber] = useState<number | null>(null);
  const selectedPage = pages.find((page) => page.pageNumber === requestedPageNumber) ?? pages[0];
  const pageTextRange = useMemo(
    () => selectedPage ? getPageTextRange(content, selectedPage.pageNumber) : null,
    [content, selectedPage],
  );

  const handlePageTextChange = (pageText: string) => {
    if (!selectedPage || !pageTextRange || disabled) return;
    const updatedContent = replaceScannedPageText(content, selectedPage.pageNumber, pageText);
    if (updatedContent !== null) onContentChange(updatedContent);
  };

  return (
    <section
      aria-labelledby="scan-comparison-title"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
            <ScanText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="scan-comparison-title" className="font-semibold tracking-tight text-slate-950 dark:text-slate-100">
              Bandingkan hasil ekstraksi
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">
              {title ? `${title} · ` : ""}Cocokkan teks dengan halaman dokumen asli sebelum melanjutkan review.
            </p>
          </div>
        </div>
        {pages.length > 0 && (
          <div className="flex items-center gap-3 sm:shrink-0">
            <label htmlFor="scan-comparison-page" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Halaman
            </label>
            <select
              id="scan-comparison-page"
              value={selectedPage?.pageNumber ?? ""}
              onChange={(event) => setRequestedPageNumber(Number(event.target.value))}
              disabled={disabled}
              className="h-9 min-w-32 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-950"
            >
              {pages.map((page) => (
                <option key={page.pageNumber} value={page.pageNumber}>
                  Halaman {page.pageNumber}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {pages.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Tidak ada halaman scan</p>
          <p className="mt-1 max-w-md text-sm leading-5 text-slate-600 dark:text-slate-400">
            Perbandingan tersedia untuk dokumen PDF yang memiliki halaman hasil scan.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-0 lg:grid-cols-2">
          <section aria-labelledby="scan-original-title" className="min-w-0 border-b border-slate-200 lg:border-b-0 lg:border-r dark:border-slate-800">
            <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
              <h3 id="scan-original-title" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Halaman asli
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Sumber scan
              </span>
            </div>
            <div className="flex min-h-[280px] items-center justify-center bg-slate-100/70 p-3 dark:bg-slate-900/45 sm:min-h-[420px] sm:p-5">
              {selectedPage && pdfUrl ? (
                <iframe
                  key={`${pdfUrl}-${selectedPage.pageNumber}`}
                  src={`${pdfUrl}#page=${selectedPage.pageNumber}&view=FitH`}
                  title={`Dokumen asli, halaman ${selectedPage.pageNumber}`}
                  className="h-[280px] w-full rounded-sm border border-slate-300 bg-white shadow-sm sm:h-[420px] dark:border-slate-700"
                />
              ) : (
                <div className="flex max-w-sm flex-col items-center text-center">
                  <AlertCircle className="h-6 w-6 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Gambar halaman tidak tersedia</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    Halaman ini masih dapat diperiksa melalui teks hasil ekstraksinya.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="scan-extracted-title" className="min-w-0">
            <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
              <h3 id="scan-extracted-title" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Teks hasil ekstraksi
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Dapat diedit</span>
            </div>
            <div className="p-4 sm:p-5">
              {pageTextRange ? (
                <>
                  <label className="sr-only" htmlFor="scan-extracted-page-text">
                    Teks hasil ekstraksi halaman {selectedPage?.pageNumber}
                  </label>
                  <Textarea
                    id="scan-extracted-page-text"
                    value={pageTextRange.text}
                    onChange={(event) => handlePageTextChange(event.target.value)}
                    disabled={disabled}
                    spellCheck
                    aria-describedby="scan-edit-guidance"
                    className="min-h-[280px] resize-y rounded-lg border-slate-300 bg-white font-mono text-sm leading-6 text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus-visible:ring-blue-600 sm:min-h-[420px] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-blue-400"
                  />
                  <p id="scan-edit-guidance" className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Perubahan disimpan pada bagian halaman ini. Penanda halaman dan teks halaman lain tetap dipertahankan.
                  </p>
                </>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-amber-300 bg-amber-50/70 px-5 py-8 text-center dark:border-amber-900 dark:bg-amber-950/25 sm:min-h-[420px]">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-amber-950 dark:text-amber-100">
                    Teks halaman tidak tersedia
                  </p>
                  <p className="mt-1 max-w-sm text-sm leading-5 text-amber-900/80 dark:text-amber-100/75" role="status">
                    Penanda “--- Halaman {selectedPage?.pageNumber} ---” tidak ditemukan pada isi dokumen. Teks tidak dapat diedit di sini agar halaman lain tidak berubah.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default DocumentScanComparison;
