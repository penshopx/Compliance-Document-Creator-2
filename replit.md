# Compliance Hub - SMAP Document Generator

## Overview
A comprehensive Compliance Hub application - SMAP (Sistem Manajemen Anti Penyuapan / Anti-Bribery Management System) Document Generator based on SNI ISO 37001:2016 Indonesian standard. The application helps organizations manage their compliance data and generate SMAP documentation templates.

## Features
- **Dashboard**: Progress tracking with stats cards showing data completion status
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
│   ├── pages/           # All page components
│   │   ├── dashboard.tsx
│   │   ├── company.tsx
│   │   ├── employees.tsx
│   │   ├── management.tsx
│   │   ├── fkap.tsx
│   │   ├── audit-internal.tsx
│   │   ├── qualifications.tsx
│   │   ├── equipment.tsx
│   │   ├── projects.tsx
│   │   ├── vendors.tsx
│   │   └── documents.tsx
│   ├── components/
│   │   ├── app-sidebar.tsx   # Main navigation sidebar
│   │   └── ui/               # Shadcn components
│   └── lib/
│       └── queryClient.ts    # API client setup
├── server/
│   ├── routes.ts             # API endpoints
│   └── storage.ts            # Database operations
└── shared/
    └── schema.ts             # Database schema & types
```

## Design Choices
- **Theme**: Professional blue color scheme (220° hue) to convey trust and compliance
- **Language**: Indonesian (Bahasa Indonesia) as per SNI ISO 37001:2016 standard
- **Date Handling**: Date fields stored as text with z.preprocess to accept empty strings and null values from forms

## Document Templates
The application includes pre-built templates for key SMAP documents:
1. Kebijakan Anti Penyuapan (Anti-Bribery Policy) - Clause 5.2
2. Sasaran Anti Penyuapan (Anti-Bribery Objectives) - Clause 6.2
3. Register Risiko Penyuapan (Bribery Risk Register) - Clause 4.5
4. Prosedur Uji Tuntas (Due Diligence Procedure) - Clause 8.2
5. Program Pelatihan SMAP (Training Program) - Clause 7.2
6. Prosedur Pelaporan Whistleblowing (Whistleblowing Procedure) - Clause 8.9

## API Endpoints
- `GET/POST/PUT /api/company` - Company profile CRUD
- `GET/POST/PUT/DELETE /api/management` - Management team
- `GET/POST/PUT/DELETE /api/employees` - Employees
- `GET/POST/PUT/DELETE /api/fkap` - FKAP team
- `GET/POST/PUT/DELETE /api/audit` - Audit team
- `GET/POST/PUT/DELETE /api/qualifications` - SBU qualifications
- `GET/POST/PUT/DELETE /api/equipment` - Equipment
- `GET/POST/PUT/DELETE /api/projects` - Projects
- `GET/POST/PUT/DELETE /api/vendors` - Vendors
- `GET /api/documents` - List documents
- `POST /api/documents/generate` - Generate document from template
- `GET /api/dashboard/stats` - Dashboard statistics

## Recent Changes
- 2026-02-01: Initial implementation complete
  - Full database schema with PostgreSQL
  - All CRUD operations working
  - Document generator with 6 templates
  - Professional UI with sidebar navigation
  - Fixed date handling to accept empty strings in forms
