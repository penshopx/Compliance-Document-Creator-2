# Compliance Hub - Multi-Industry Document Generator Platform

## Overview
A comprehensive compliance platform for Indonesian businesses across **20 industries**, organized around **5 Core Compliance Domains**. Each industry has specialized templates, document workflows, AI chatbot persona, and compliance requirements organized within this unified framework.

## 5 Core Compliance Domains (Framework)
All documents across all 20 industries are organized into these 5 domains:

1. **Legalitas** - Legal foundation documents
   - Akta Pendirian, NIB (OSS), NPWP, TDP, Domisili, PKP
   - Basic company registration and legal identity

2. **Perijinan** - Business licensing & permits  
   - Industry-specific licenses (SBU, SKK, SIUP, IUPTL, etc.)
   - Operational permits required by regulators

3. **Sertifikasi** - Certification & standards
   - ISO (9001, 14001, 37001, 45001), SNI, K3
   - Professional certifications (SKK for construction, SKTTK for energy)

4. **Tender** - Procurement & bidding
   - Qualification documents, proposals, RAB
   - Tender submissions and contract documents

5. **Operasional** - Operations & production
   - SOP, work instructions, reports
   - Quality control, HSE, daily operational documents

### Supported Industries (20 Total):
1. **SMAP** - SNI ISO 37001:2016 Anti-Bribery Management
2. **Pancek** - Panduan Cegah Korupsi KPK
3. **Konstruksi** - Construction (SBU, SKK, NIB) - *Note: SKA/SKT replaced by SKK, SIUJK replaced by NIB*
4. **Energi** - Energy sector (IUPTL, SLO, SKTTK)
5. **Migas** - Oil & Gas (KKKS, WP&B)
6. **Lingkungan** - Environmental (AMDAL, UKL-UPL)
7. **UMKM** - Small Business (NIB, IUMK, Halal)
8. **ISO** - ISO Standards (9001, 14001, 45001)
9. **K3** - Occupational Health & Safety
10. **Tender** - Procurement & Bidding
11. **Keuangan** - Finance & Accounting
12. **Kesehatan** - Healthcare (KARS, SNARS)
13. **Pendidikan** - Education (BAN-PT, KKNI)
14. **Teknologi** - Technology (PSE, UU PDP)
15. **Pertanian** - Agriculture (Organic, GAP)
16. **Manufaktur** - Manufacturing (ISO 9001, GMP)
17. **Properti** - Real Estate (SHGB, PPJB)
18. **Logistik** - Logistics (SIUJPT, Export-Import)
19. **Pariwisata** - Tourism (TDUP, CHSE)
20. **Telekomunikasi** - Telecommunications (ISR, Spectrum)

## User Preferences
I prefer detailed explanations and clear communication. I want iterative development where I am informed before major changes are implemented. I prioritize functionality and robust backend systems.

## Development Roadmap Notes
- **Current State (Feb 2026)**: 20 industries with 5 compliance domains framework complete
- **SMAP & Pancek**: Full-featured with integrated document generation, templates, PDCA generator
- **Other 18 Industries**: Basic pathway with external knowledge base (chat.dokumentender.com)
- **Future Priority**: Industries will be expanded with full features based on market segment demand/interest

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