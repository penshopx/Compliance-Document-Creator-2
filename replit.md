# Compliance Hub - SMAP Document Generator

## Overview
A comprehensive Compliance Hub application - SMAP (Sistem Manajemen Anti Penyuapan / Anti-Bribery Management System) Document Generator based on SNI ISO 37001:2016 Indonesian standard. The application helps organizations manage their compliance data and generate SMAP documentation templates.

## Features
- **Dashboard**: Progress tracking with stats cards, quick access to document generators
- **Company Profile**: Full company information management
- **Personnel Management**: 
  - Management Team (Dewan Direksi)
  - FKAP Team (Fungsi Kepatuhan Anti Penyuapan)
  - Internal Audit Team
  - Employees
- **Asset Management**: Equipment and machinery tracking
- **Qualifications**: SBU (Sertifikat Badan Usaha) classifications
- **Projects**: Project portfolio management
- **Vendors**: Vendor management with due diligence status
- **SMAP Checklist** (Permen PU 08/2022): Compliance verification tool
  - 23 pertanyaan dalam 4 bagian (Komitmen, Perencanaan, Pelaksanaan, Evaluasi)
  - Interactive status tracking (Ada/Tidak/Pending)
  - Compliance percentage calculation with progress bars
  - Dokumen Perencanaan SMAP (16 item)
  - Dokumen Rekaman Pelaksanaan SMAP (6 item)
  - Export to CSV functionality
- **Document Generator**: Pre-built templates for ISO 37001 SMAP documents
- **AI Prompt Generator** (Document Builder): AI prompt generator for SMAP documents
  - 9 professional SMAP templates (Pedoman, SK, Kebijakan, SOP, Formulir, Register, Berita Acara)
  - Category-based filtering
  - Auto-population with company, management, FKAP data
  - Generates structured prompts for use with dokumenttender.com or other AI models
  - Copy prompt to clipboard functionality
  - Additional context input for customization
- **SMAP Reference** (NEW): Comprehensive document reference table
  - 46 document references organized by category (Pedoman, Kebijakan, SOP, Formulir, Register, Instruksi)
  - Quick stats cards for document counts by category
  - Search and filter functionality
  - Expandable rows for document descriptions
  - Copy document info and Export to CSV
- **PDCA Generator**: Advanced document generator with PDCA methodology
  - Plan, Do, Check, Act navigation tabs
  - 51 clause items across PDCA phases
  - Document draft generation with company context
  - AI Prompt Master for ChatGPT/Gemini integration
  - Mega Repository with document templates
- **AI Integration**: Gemini AI integration via Replit AI Integrations
  - Uses gemini-2.5-flash and gemini-2.5-pro models
  - No API key required (uses Replit credits)

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **UI Components**: Shadcn/UI + Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod

## Project Structure
```
├── client/src/
│   ├── pages/
│   │   ├── dashboard.tsx         # Main dashboard with stats & quick links
│   │   ├── company.tsx           # Company profile management
│   │   ├── employees.tsx         # Employee management
│   │   ├── management.tsx        # Management team
│   │   ├── fkap.tsx              # FKAP team management
│   │   ├── audit-internal.tsx    # Internal audit team
│   │   ├── qualifications.tsx    # SBU qualifications
│   │   ├── equipment.tsx         # Equipment tracking
│   │   ├── projects.tsx          # Project portfolio
│   │   ├── vendors.tsx           # Vendor management
│   │   ├── documents.tsx         # Basic document generator
│   │   ├── document-builder.tsx  # Advanced SMAP document builder
│   │   ├── pdca-generator.tsx    # PDCA Generator with three-panel layout
│   │   └── smap-reference.tsx    # SMAP document reference table
│   ├── components/
│   │   ├── app-sidebar.tsx       # Main navigation sidebar
│   │   └── ui/                   # Shadcn components
│   └── lib/
│       └── queryClient.ts        # API client setup
├── server/
│   ├── routes.ts                 # API endpoints
│   └── storage.ts                # Database operations
└── shared/
    └── schema.ts                 # Database schema & types
```

## Database Schema
### Core Tables
- `companies` - Company profile data
- `management_team` - Directors and management
- `employees` - Staff records
- `fkap_team` - Anti-bribery compliance team
- `audit_team` - Internal audit team
- `qualifications` - SBU certifications
- `equipment` - Assets and machinery
- `projects` - Project portfolio
- `vendors` - Business partners and vendors

### Document Tables
- `documents` - Basic generated documents
- `generated_documents` - Advanced SMAP documents with metadata
- `document_templates` - Template definitions
- `clause_references` - ISO 37001 clause library

## Design Choices
- **Theme**: Professional blue color scheme (220° hue) to convey trust and compliance
- **Language**: Indonesian (Bahasa Indonesia) as per SNI ISO 37001:2016 standard
- **Date Handling**: Date fields stored as text with z.preprocess to accept empty strings and null values from forms

## AI Prompt Generator Templates
1. **Pedoman SMAP (Manual)** (4-10) - Complete ABMS Manual/Guideline
2. **SK Penetapan Tim FKAP** (5.3.2) - FKAP Team Appointment Decree
3. **Kebijakan Anti Penyuapan** (5.2) - Anti-Bribery Policy
4. **Pakta Integritas Personel** (7.2.2.3) - Personnel Integrity Pact
5. **SOP Uji Tuntas Mitra Bisnis** (8.2) - Due Diligence SOP
6. **Register Risiko Penyuapan** (4.5) - Bribery Risk Register
7. **Checklist Audit Internal SMAP** (9.2) - Internal Audit Checklist
8. **Berita Acara RTM** (9.3) - Management Review Meeting Minutes
9. **Sasaran & Program Anti Penyuapan** (6.2) - Anti-Bribery Objectives & Programs

## PDCA Generator Clauses
- **Plan** (16 clauses): Policies, risks, objectives, resources, training, documentation
- **Do** (6 clauses): Leadership, commitment, risk assessment, monitoring
- **Check** (23 clauses): Compliance checklist items (C.01 - C.23)
- **Act** (6 clauses): Corrective actions, continuous improvement, lessons learned

## API Endpoints
### Data Management
- `GET/POST/PUT /api/company` - Company profile CRUD
- `GET/POST/PUT/DELETE /api/management` - Management team
- `GET/POST/PUT/DELETE /api/employees` - Employees
- `GET/POST/PUT/DELETE /api/fkap` - FKAP team
- `GET/POST/PUT/DELETE /api/audit` - Audit team
- `GET/POST/PUT/DELETE /api/qualifications` - SBU qualifications
- `GET/POST/PUT/DELETE /api/equipment` - Equipment
- `GET/POST/PUT/DELETE /api/projects` - Projects
- `GET/POST/PUT/DELETE /api/vendors` - Vendors

### Document Generation
- `GET /api/documents` - List basic documents
- `POST /api/documents/generate` - Generate basic document
- `GET/POST/PUT/DELETE /api/generated-documents` - Advanced document CRUD
- `POST /api/generate-smap-document` - Generate SMAP document with context
- `GET /api/document-templates` - List available templates
- `GET /api/clause-references` - Get ISO 37001 clause references

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics including document count

### AI Generation (Gemini)
- `POST /api/ai/generate` - Generate content with custom prompt
- `POST /api/ai/generate-smap` - Generate SMAP document with company context

## SMAP Document Reference
The application includes a comprehensive reference table with 46 documents:
- **Pedoman** (1): Pedoman SMAP utama
- **Kebijakan** (4): Anti Penyuapan, Hadiah, Donasi, Konflik Kepentingan
- **SOP** (16): Prosedur operasional dari pasal 4.5 - 10.2
- **Formulir** (17): Template pencatatan dan dokumentasi
- **Register** (5): Daftar pemantauan (Risiko, Hadiah, WBS, Rekan Bisnis, Pelatihan)
- **Instruksi** (3): Panduan teknis pelaksanaan tugas

## Template Repository
Comprehensive SMAP template/toolbox collection with 200 document templates covering all ISO 37001:2016 clauses:

### Template Categories (12 types):
- **Pedoman** (5): Dokumen induk SMAP, manual, struktur organisasi
- **Kebijakan** (11): Anti Penyuapan, Hadiah, Donasi, Konflik Kepentingan, Kontribusi Politik, WBS, Investigasi, Sanksi
- **SK** (4): Surat Keputusan Direktur (Komitmen, FKAP, Audit)
- **SOP** (27): Prosedur operasional dari klausul 4.5 - 10.2
- **Instruksi Kerja** (12): Panduan teknis pelaksanaan tugas
- **Formulir** (42): Template pencatatan dan dokumentasi
- **Register** (24): Daftar pemantauan (Risiko, Hadiah, WBS, Mitra Bisnis, Pelatihan, dll)
- **Laporan** (19): Laporan analisis, kinerja, investigasi
- **Berita Acara** (3): Notulen rapat dan tinjauan
- **Matriks** (14): Matriks tanggung jawab, risiko, sanksi, otorisasi
- **Program** (8): Program kerja tahunan
- **Checklist** (11): Checklist audit, uji tuntas, penilaian

### Template Structure:
Each template includes:
- Kode Dokumen (unique identifier, e.g., SOP-RIS-001, FOR-UTU-001)
- Nama (Indonesian) and English name
- Kategori (document type)
- Klausul ISO 37001 (4.1 - 10.2) with sub-clauses
- Deskripsi (description)
- Penanggung Jawab (responsible person)
- Frekuensi (frequency)
- Tingkat Kritis (Wajib/Penting/Pendukung)
- Area Bisnis (16 business areas)
- Prompt Template for AI generation

### Features:
- Advanced search by name, code, description, clause
- Multi-level filtering (category, clause, business area, criticality)
- Grid and List view modes
- AI Prompt generation with placeholder company context
- Export to CSV functionality
- Integration with dokumenttender.com or other AI models

### ISO 37001 Clause Coverage (200 templates):
- Klausul 4: Konteks Organisasi (25 templates) - Context analysis, stakeholders, scope, risk assessment
- Klausul 5: Kepemimpinan (30 templates) - Leadership commitment, policies, FKAP, delegation
- Klausul 6: Perencanaan (15 templates) - Objectives, programs, risk treatment
- Klausul 7: Dukungan (40 templates) - Resources, competency, training, communication, documentation
- Klausul 8: Operasi (50 templates) - Due diligence, controls, gifts, WBS, investigation
- Klausul 9: Evaluasi Kinerja (25 templates) - Monitoring, audit, management review
- Klausul 10: Perbaikan (15 templates) - Nonconformity, corrective action, continual improvement

## Recent Changes
- 2026-02-01: Expanded Template Repository to 200 SMAP templates
  - Complete coverage of all ISO 37001:2016 clauses and sub-clauses
  - Detailed templates for each document type
  - Enhanced filtering by clause, category, area bisnis, tingkat kritis
  - Data stored in client/src/data/smap-templates-full.ts
- 2026-02-01: Added Template Repository with 120+ SMAP templates
  - Comprehensive document templates covering all ISO 37001:2016 clauses
  - Advanced filtering by category, clause, business area, criticality level
  - AI prompt generation integrated with company context
  - Grid/List view modes with CSV export
  - Data stored in client/src/data/smap-templates.ts
- 2026-02-01: Converted Document Builder to AI Prompt Generator
  - Output is now AI prompts (not full documents) to avoid token limitations
  - Designed for use with dokumenttender.com AI aggregator
  - 9 templates with detailed prompt structures based on real SMAP documents
  - Prompts include company context, FKAP team, management data
  - Added "Konteks Tambahan" input for customization
- 2026-02-01: Enhanced PDCA Generator AI Prompt Master
  - Structured prompts with PDCA phase context
  - Includes legal references (UU, Permen PU, SNI ISO 37001)
  - Better formatting for AI model consumption
- 2026-02-01: Added SMAP Reference page
  - 46 document references with search and filter
  - Stats cards for category counts
  - Export to CSV functionality
  - Gemini AI integration for future document generation
- 2026-02-01: Enhanced Dashboard
  - Quick access cards to all document generators
  - Generated document count display
- 2026-02-01: Added PDCA Generator feature
  - Three-panel layout with PDCA navigation
  - 51 clause items across Plan, Do, Check, Act phases
  - Document draft generation with narasi input
  - AI Prompt Master for ChatGPT integration
  - Mega Repository with 22 document templates organized by category
  - Fixed Tailwind dynamic class issue
- 2026-02-01: Initial implementation complete
  - Full database schema with PostgreSQL
  - All CRUD operations working
  - Document generator with 6 templates
  - Professional UI with sidebar navigation
  - Fixed date handling to accept empty strings in forms
