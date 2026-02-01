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
- **Document Generator**: Pre-built templates for ISO 37001 SMAP documents
- **Document Builder** (NEW): Advanced document generator with company context
  - 7 professional SMAP templates
  - Category-based filtering (SK, Kebijakan, SOP, Formulir, Register, Berita Acara)
  - Auto-population with company, management, FKAP, and vendor data
  - Preview, copy, and download functionality
  - Document history tracking
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
  - Mega Repository with 85+ document templates
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

## Document Builder Templates
1. **SK Penetapan Tim FKAP** (5.3.2) - FKAP Team Appointment Decree
2. **Kebijakan Anti Penyuapan** (5.2) - Anti-Bribery Policy
3. **Pakta Integritas Personel** (7.2.2.3) - Personnel Integrity Pact
4. **SOP Uji Tuntas Mitra Bisnis** (8.2) - Due Diligence SOP
5. **Register Risiko Penyuapan** (4.5) - Bribery Risk Register
6. **Checklist Audit Internal SMAP** (9.2) - Internal Audit Checklist
7. **Berita Acara RTM** (9.3) - Management Review Meeting Minutes

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

## Recent Changes
- 2026-02-01: Added SMAP Reference page
  - 46 document references with search and filter
  - Stats cards for category counts
  - Export to CSV functionality
  - Gemini AI integration for future document generation
- 2026-02-01: Added Document Builder feature
  - 7 professional SMAP document templates
  - Auto-population with company data
  - Preview, copy, and download functionality
  - Document history and management
  - Category filtering for templates
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
