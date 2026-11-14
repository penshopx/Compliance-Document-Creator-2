import type { Express, RequestHandler } from "express";
import multer from "multer";

import {
  extractUploadedDocument,
  MAX_DOCUMENT_UPLOAD_BYTES,
} from "./document-extraction";
import {
  mapDocumentExtractionFailure,
  mapDocumentUploadMiddlewareFailure,
} from "./document-upload-errors";

const documentSimulatorUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_UPLOAD_BYTES, files: 1 },
}).single("file");

export function registerDocumentExtractionRoute(
  app: Express,
  authenticate: RequestHandler,
): void {
  app.post("/api/document-simulator/extract", authenticate, (req, res, next) => {
    documentSimulatorUpload(req, res, (error) => {
      if (!error) return next();
      const failure = mapDocumentUploadMiddlewareFailure(error);
      return res.status(failure.status).json({ error: failure.error });
    });
  }, async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Pilih file PDF atau Word." });

    try {
      const result = await extractUploadedDocument(file.buffer, file.originalname);
      res.json(result);
    } catch (error) {
      const failure = mapDocumentExtractionFailure(error);
      if (failure.status === 500) console.error("Document simulator extraction error:", error);
      return res.status(failure.status).json({ error: failure.error });
    }
  });
}
