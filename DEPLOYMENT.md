# Environment Setup and Deployment Guide

You now have a full autonomous AI product stack. Here's how to wire it all up and run in production.

## Environment Setup (`.env`)

Rename `.env.example` to `.env` and add your live credentials:

```env
# OPENAI
OPENAI_API_KEY=sk-...

# SUPABASE (if used)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# EMAIL (SendGrid)
SENDGRID_API_KEY=SG.abc123...
ADMIN_EMAIL=team@nsaie.com

# SITE
BASE_URL=https://nsaie.com
```

## Quick Start Commands

From the project root (`nsai-emagine/`):

```bash
npm install          # Install all dependencies
npm run dev          # Start development server
```

To run Operator logic manually (simulate cron tasks):

```bash
ts-node backend/operator/complyCron.ts
ts-node backend/operator/nichePublish.ts
ts-node backend/operator/grantScan.ts
ts-node backend/operator/hostAutomation.ts
```

## Deployment Recommendations

| Service       | Use For                       | Recommendation                                  |
| ------------- | ----------------------------- | ----------------------------------------------- |
| **Vercel**    | Hosting frontend + API routes | Fast CI/CD, great with Next.js                  |
| **Supabase**  | Auth, DB, functions           | Easy serverless backend                         |
| **SendGrid**  | Email delivery                | Required for emails and notifications           |
| **Scheduler** | Operator automation           | GitHub Actions, Supabase Cron, or Railway tasks |
| **Twilio**    | SMS notifications             | Optional for HostFlow cleaner alerts            |

## Launch Checklist

* [x] Phase 1 Apps fully implemented (`Comply`, `NichePress`)
* [x] Phase 2 Apps fully implemented (`GrantBot`, `HireEdge`)
* [x] Phase 3 Apps fully implemented (`HostFlow`)
* [x] Operator scripts for automation
* [x] Environment ready (.env variables)
* [x] Modular design for scaling future tools

## What You Do Next

You only need to:

1. **Paste your credentials into `.env`**
2. **Deploy to Vercel or any Node-capable host**
3. **Connect a cron job runner or use Supabase Edge Functions**
4. **Integrate with property management systems (for HostFlow)**
5. **Grow, iterate, and scale**

This is now a **production-ready, enterprise-grade AI stack** — autonomous, extensible, and on-brand with the NSAI Emagine vision.