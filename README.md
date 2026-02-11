# Hub Manager

A multi-tenant organization management platform built with Next.js, TypeScript, and MongoDB.

## Features

- **Multi-tenant Architecture**: Organization-based routing with isolated dashboards
- **Authentication**: JWT-based auth with MFA, magic links, and trusted devices
- **User Management**: Role-based access control with email/phone verification
- **Organization Management**: Create and manage organizations with custom modules
- **Secure Sessions**: HTTP-only cookies with refresh token rotation

## Tech Stack

- **Framework**: Next.js 16.1.6 (Turbopack)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens, bcrypt password hashing
- **Validation**: Zod schemas with React Hook Form
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- npm/yarn/pnpm/bun

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hub-manager/
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── (organisation)/      # Organization-specific routes
│   ├── api/                 # API endpoints
│   └── dashboard/           # Dashboard redirect
├── components/
│   └── sidebar/             # Sidebar components
├── lib/
│   ├── actions/             # Server actions
│   ├── helpers/             # Utility functions
│   └── models/              # Mongoose models
└── providers/               # React context providers
```

## Authentication Flow

1. User signs in with email/password or magic link
2. MFA verification if enabled (with trusted device support)
3. JWT tokens stored in HTTP-only cookies
4. Redirect to `/{organizationId}/dashboard/{userId}`
5. Session validated on protected routes

## API Routes

- `POST /api/auth/logout` - Clear auth cookies and logout

## Key Models

- **User**: Authentication, roles, verification status
- **Organization**: Multi-tenant organization data
- **Session**: In-memory cache with 15-minute TTL

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

Deploy on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hub-manager)

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.

## License

MIT
