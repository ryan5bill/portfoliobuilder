# Portfolio Builder Website
## pbtracker.app

A Next.js application for tracking model portfolios and building investment track records.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework (App Router) |
| Tailwind CSS | Styling |
| Supabase | Database & Auth |
| Recharts | Charts |
| Lucide React | Icons |

---

## Project Structure

```
pbtracker-website/
├── app/                      # Next.js App Router pages
│   ├── layout.jsx            # Root layout
│   ├── page.jsx              # Landing page
│   ├── globals.css           # Global styles
│   ├── (auth)/               # Auth pages (login, signup)
│   ├── (member)/             # Member dashboard pages
│   ├── (admin)/              # Admin panel pages
│   ├── portfolio/            # Public portfolio view
│   └── api/                  # API routes
├── components/               # React components
│   ├── Header.jsx
│   ├── MonthlyReturns.jsx
│   ├── PositionsTable.jsx
│   ├── Calculator.jsx
│   └── ...
├── lib/                      # Utilities & data
│   ├── theme.js              # Design system
│   ├── sampleData.js         # Placeholder data (replace later)
│   └── supabase.js           # Supabase client
└── public/                   # Static assets
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Required (Phase 0)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `ADMIN_PASSWORD` - Admin panel password

### Optional (Phase 2+)
- `ANTHROPIC_API_KEY` - Claude API for admin assistant
- `BEEHIIV_API_KEY` - Email marketing
- `TWILIO_ACCOUNT_SID` - SMS alerts

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/sampleData.js` | **Replace with real track record data** |
| `lib/theme.js` | Colors, fonts, utility functions |
| `app/globals.css` | Tailwind config + custom styles |

---

## Development Phases

### Phase 1: Foundation ✓
- Project setup
- Design system
- Landing page
- Core components

### Phase 2: Public Pages
- Portfolio display
- Monthly returns heatmap
- Position calculator

### Phase 3: User Features
- Authentication
- Member dashboard
- User portfolio tracking

### Phase 4: Admin Panel
- Portfolio editor
- Trade alerts manager
- User management
- Broadcasts

### Phase 5: Integrations
- Beehiiv (email)
- Twilio (SMS)
- Auto price updates

---

## Data Import

The `lib/sampleData.js` file contains placeholder data.

To import real track record:
1. Use the Portfolio Template tool to build your data
2. Export JSON from the template
3. Update `lib/sampleData.js` with real data
4. Or: Import to Supabase and fetch dynamically

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs

---

## License

Private - All rights reserved.
