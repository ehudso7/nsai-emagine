# NSAI Emagine

![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)
![Status: Launch Ready](https://img.shields.io/badge/Status-Launch%20Ready-brightgreen)

> Autonomous micro-service platform powered by GPT-4 and operator automation logic

## Overview

NSAI Emagine is a comprehensive AI platform comprising multiple specialized tools designed to automate various business processes. The platform leverages OpenAI's GPT-4 to provide intelligent automation across content creation, compliance, job applications, grant discovery, hospitality management, and business growth.

## Repository Structure

This monorepo contains all components of the NSAI Emagine platform:

```
nsai-emagine/
├── apps/                    # Frontend applications
│   ├── comply/              # Privacy policy generator
│   ├── nichepress/          # SEO blog generator
│   ├── grantbot/            # Grant finder and auto-filler
│   ├── hireedge/            # Resume and cover letter generator
│   ├── hostflow/            # Airbnb host automation
│   ├── advisor/             # Business growth coach
│   ├── monetizer/           # Content monetization tools
│   ├── integrator/          # Workflow automation engine
│   ├── dashboard/           # Unified dashboard
│   ├── billing/             # Subscription management
│   └── landing/             # Marketing landing page
│
├── backend/                 # Backend services
│   └── operator/            # Automated tasks and scheduling
│
├── shared/                  # Shared code across applications
│   ├── ai/                  # AI prompts and utilities
│   │   └── prompts/         # GPT prompt templates
│   ├── components/          # React components
│   │   └── ui/              # UI elements
│   └── lib/                 # Utility functions
│
├── pages/                   # Next.js routing
│   ├── api/                 # API endpoints
│   └── ...                  # Page routes
│
├── styles/                  # Global styles
├── public/                  # Static assets
└── scripts/                 # Utility scripts
```

## Development Tools

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API routes
- **AI Integration**: OpenAI GPT-4
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Ready for Supabase Auth (stubbed)
- **Payment Processing**: Ready for Stripe integration (stubbed)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key
- SendGrid API key (for email notifications)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/nsai-emagine.git
cd nsai-emagine
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with required environment variables
```
OPENAI_API_KEY=your_api_key
SENDGRID_API_KEY=your_sendgrid_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project includes a deployment script that supports Vercel, Netlify, and other platforms:

```bash
./deploy.sh
```

## Contributing

This is a proprietary project and is not open for external contributions.

## License

All rights reserved. This code is proprietary and confidential.

---

&copy; 2023 NSAI Emagine. All rights reserved.