# Compliance Hub - SMAP & Pancek

## Overview
Compliance Hub is a dual-path application designed for Indonesian construction companies to manage anti-bribery and anti-corruption compliance. It supports both the international **SMAP (SNI ISO 37001:2016)** certification and the national **Pancek (Panduan Cegah Korupsi KPK)** framework. The system streamlines compliance efforts through AI-powered document generation, checklist tracking, and comprehensive management tools, aiming to enhance corporate governance and integrity within the Indonesian construction sector.

## User Preferences
I prefer detailed explanations and clear communication. I want iterative development where I am informed before major changes are implemented. I prioritize functionality and robust backend systems.

## System Architecture
The application is built with a **React + Vite + TypeScript** frontend utilizing **Shadcn/UI** and **Tailwind CSS** for a professional UI/UX, characterized by a blue color scheme (220° hue) to convey trust. State management is handled by **TanStack Query** and routing by **Wouter**. The backend is implemented with **Express.js**, connecting to a **PostgreSQL** database managed with **Drizzle ORM**. **Zod** is used for data validation.

The system supports two primary compliance pathways:
- **Pancek**: Features 6 PDCAR phases (Plan, Do, Check, Act, Respon), 30+ checklist items, 25+ document templates, AI prompt generation, and integration references to Platform Jaga.id.
- **SMAP**: Offers a comprehensive dashboard, company/personnel/asset/project/vendor management, an interactive SMAP Checklist (based on Permen PU 08/2022), and advanced document generation tools. Key features include an **AI Prompt Generator** with 9 professional SMAP templates (e.g., Pedoman, Kebijakan, SOP) that auto-populate with company data, a **SMAP Reference** table with 46 documents, a **PDCA Generator** supporting 51 clauses across Plan, Do, Check, Act phases for document drafting, and **Produk Siap SMAP** which guides companies through 4 phases of SMAP implementation readiness (Dokumen, Audit Internal, Sertifikasi, Surveilance & Perpanjangan).

The core architecture includes:
- **Data Management**: CRUD operations for company profiles, teams (management, FKAP, audit), employees, qualifications, equipment, projects, and vendors.
- **Document Management**: APIs for listing and generating basic documents, and CRUD for advanced SMAP documents with metadata. A vast **Template Repository** contains over 270 SMAP document templates categorized by type, ISO clause, business area, and criticality, supporting advanced search and filtering.
- **AI Integration**: AI prompt generation for documents, designed to be used with external AI models like those from dokumenttender.com, using context from the application.

## Payment System
The application uses Indonesian payment methods with manual verification:

### Payment Methods
- **Transfer Bank**: BCA, Mandiri, BRI, BNI with manual confirmation
- **E-Wallet & QRIS**: GoPay, OVO, Dana, ShopeePay via QRIS

### Pricing Tiers (Phase-Based)

**SMAP Packages (4 Phases):**
- **Siap Dokumen SMAP**: Rp 2.500.000/month - Complete documentation preparation for SNI ISO 37001:2016
- **Siap Audit Internal**: Rp 3.500.000/month - Internal audit preparation and compliance evaluation
- **Siap Audit Eksternal**: Rp 5.000.000/month - External audit/certification preparation
- **Siap Surveilance**: Rp 3.000.000/month - Certificate maintenance and renewal

**Pancek Packages (3 Phases):**
- **Siap Pengisian Kuesioner**: Rp 1.500.000/month - Platform Jaga.id questionnaire preparation
- **Siap Terverifikasi**: Rp 2.500.000/month - KPK/Jaga.id verification preparation
- **Siap Surveilance Pancek**: Rp 2.000.000/month - Verified status maintenance

### Payment Flow
1. User selects plan and payment method on `/checkout` page
2. System creates payment order with unique order number (24-hour expiry)
3. User transfers to designated bank account or scans QRIS
4. User confirms payment via app or WhatsApp (0812-3456-7890)
5. Admin verifies payment via `/api/admin/payment-orders/:id/verify`
6. System activates subscription for 1 month

### Database Tables
- `subscription_plans`: Plan definitions with features and pricing
- `payment_orders`: Order tracking with status (pending, pending_confirmation, paid)
- `user_subscriptions`: Active user subscriptions with period dates

### Admin Configuration
Set `ADMIN_USER_IDS` environment variable (comma-separated user IDs) to restrict admin endpoints. If not set, all authenticated users have admin access (development mode).

## External Dependencies
- **PostgreSQL**: Primary database for all application data.
- **Shadcn/UI**: UI component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **TanStack Query**: Data fetching and state management library.
- **Wouter**: Routing library.
- **Express.js**: Backend web framework.
- **Drizzle ORM**: TypeScript ORM for PostgreSQL.
- **Zod**: Schema validation library.
- **Replit Auth**: User authentication via Google/GitHub/Apple/email login with PostgreSQL sessions.
- **Replit AI Integrations (Gemini)**: Utilizes `gemini-2.5-flash` and `gemini-2.5-pro` models for AI-powered content generation, leveraging Replit credits.
- **Platform Jaga.id**: External platform referenced for Pancek pathway integration.
- **dokumenttender.com**: Referenced as a potential external AI aggregator for generated prompts.