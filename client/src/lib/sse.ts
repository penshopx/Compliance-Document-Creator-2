export interface JsonSseEvent {
  content?: string;
  error?: string;
  done?: boolean;
}

function parseEventBlock(block: string): JsonSseEvent | null {
  const payload = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  if (!payload) return null;
  return JSON.parse(payload) as JsonSseEvent;
}

export async function consumeJsonSse(
  response: Response,
  onEvent: (event: JsonSseEvent) => void,
): Promise<void> {
  if (!response.body) {
    throw new Error("Server tidak mengirimkan stream AI.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;

  const processBuffer = (flush = false) => {
    const blocks = buffer.split(/\r?\n\r?\n/);
    const remainder = blocks.pop() || "";
    buffer = flush ? "" : remainder;

    for (const block of blocks) {
      const event = parseEventBlock(block);
      if (!event) continue;
      onEvent(event);
      if (event.done === true) completed = true;
      if (event.error) throw new Error(event.error);
    }

    if (flush && remainder.trim()) {
      const event = parseEventBlock(remainder);
      if (event) {
        onEvent(event);
        if (event.done === true) completed = true;
        if (event.error) throw new Error(event.error);
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    processBuffer();
  }

  buffer += decoder.decode();
  processBuffer(true);

  if (!completed) {
    throw new Error(
      "Koneksi AI terputus sebelum proses selesai. Hasil sebagian tidak ditandai sebagai dokumen final.",
    );
  }
}