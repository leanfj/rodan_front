# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Rodan Admin Dashboard is a modern React-based admin interface with multi-tenant architecture. It supports light/dark themes, responsive design, and role-based access control with tenant-specific customizations.

## Development Commands

### Core Development
- `pnpm dev` - Start development server on default port
- `pnpm dev:host` - Start development server with host binding
- `pnpm start` - Start production-like server on port 3000 with specific host
- `pnpm build` - Build for production (runs TypeScript check first)
- `pnpm preview` - Preview production build

### Code Quality & Maintenance
- `pnpm lint` - Run ESLint on all TypeScript files
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting without changes
- `pnpm knip` - Find unused dependencies and exports

### Docker & Deployment
- `make deploy` - Full deployment (rsync + Docker rebuild)
- `docker compose up --build -d` - Local Docker development
- `docker compose -f docker-compose.dev.yml up` - Development Docker setup

## Architecture Overview

### Multi-Tenant System
The application implements a sophisticated multi-tenant architecture where:

**Tenant** = Organization/Client (identified by email domain)
- Controls features, branding, and UI customizations
- Configuration in `/src/config/tenant-config.ts`
- Each tenant has unique domain, branding, and feature toggles

**Role** = Access level within organization (admin, manager, user, etc.)
- Controls permissions and navigation visibility
- Applied within tenant context
- Can be overridden per tenant for specific needs

### Key Architecture Components

#### Configuration System (`/src/config/tenant-config.ts`)
- `TenantConfig`: Defines per-organization customizations
- `RoleConfig`: Defines access levels and permissions
- `getTenantFromEmail()`: Maps email domains to tenants
- `getRoleConfig()`: Applies role permissions with tenant overrides

#### State Management (`/src/stores/`)
- `authStore.ts`: Zustand-based authentication state with cookies/localStorage
- `authStore.extensions.ts`: Utility functions for permission checking
- Authentication persisted across sessions using cookies for tokens

#### Routing (`/src/routes/`)
- TanStack Router with type-safe routing
- Protected routes in `/_authenticated/` directory
- Separate auth routes in `/(auth)/` directory
- Error boundaries for different HTTP status codes

#### Component Architecture
- **Layout Components** (`/src/components/layout/`): Sidebar, header, navigation
- **UI Components** (`/src/components/ui/`): ShadcnUI-based design system
- **Feature Components** (`/src/features/`): Page-level components by domain

### Navigation & Permission System

The sidebar dynamically filters based on:
1. **User Role**: Base permissions and allowed navigation groups
2. **Tenant Features**: Organization-level feature toggles
3. **Tenant Overrides**: Specific role modifications per tenant

Example: A "user" role in "xyz-startup" tenant might have different menu access than the same role in "abc-corp" tenant.

### Hooks System (`/src/hooks/`)
- `useSidebarData()`: Returns filtered navigation based on tenant + role
- `useTenantCustomizations()`: Gets tenant-specific UI customizations
- `useTenantInfo()`: Current tenant and user role information
- `usePermissions()`: Permission checking utilities

## Development Guidelines

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── layout/          # App layout components
│   └── ui/              # ShadcnUI components (auto-generated)
├── config/              # Configuration files
├── features/            # Feature-based page components
├── hooks/               # Custom React hooks
├── routes/              # TanStack Router route definitions
├── stores/              # Zustand state management
├── services/            # API and external services
└── utils/               # Utility functions
```

### Adding New Features
1. **New Pages**: Create in `/src/features/{domain}/`
2. **New Routes**: Add route files in `/src/routes/` (auto-generates route tree)
3. **Navigation**: Update tenant config to control menu visibility
4. **Permissions**: Use `usePermissions()` hook for access control

### Tenant Configuration
To add a new tenant:
1. Add entry to `tenantConfigs` in `/src/config/tenant-config.ts`
2. Define domain, branding, features, and any role overrides
3. Test with email using the configured domain

### Component Development
- Use ShadcnUI components from `/src/components/ui/`
- Follow existing patterns in layout components
- Utilize TypeScript interfaces for type safety
- Apply tenant customizations via `useTenantCustomizations()`

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6 with SWC
- **Routing**: TanStack Router (type-safe)
- **State**: Zustand for auth, React Query for server state
- **UI Framework**: ShadcnUI (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Tabler Icons and Lucide React
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next with react-i18next

## Common Development Patterns

### Adding Protected Routes
```typescript
// In /src/routes/_authenticated/new-feature.tsx
import { createFileRoute } from '@tanstack/react-router'
import { NewFeaturePage } from '@/features/new-feature'

export const Route = createFileRoute('/_authenticated/new-feature')({
  component: NewFeaturePage,
})
```

### Permission Checking
```typescript
import { usePermissions } from '@/hooks/use-sidebar-data'

function MyComponent() {
  const { hasPermission } = usePermissions()
  
  if (!hasPermission('manage_users')) {
    return <div>Access denied</div>
  }
  
  return <UserManagement />
}
```

### Tenant-Aware Components
```typescript
import { useTenantCustomizations } from '@/hooks/use-sidebar-data'

function BrandedHeader() {
  const customizations = useTenantCustomizations()
  const { customBranding } = customizations
  
  return (
    <header style={{ color: customBranding?.primaryColor }}>
      {customBranding?.companyName || 'Default Company'}
    </header>
  )
}
```

## Environment & Deployment

### Development Environment
- Uses `.env.development` for local environment variables
- Vite handles environment variable loading automatically
- Access via `import.meta.env.VITE_*`

### Production Deployment
- Docker-based deployment with Nginx
- Traefik reverse proxy configuration
- Build artifacts served from `/dist`
- Deployment via `make deploy` command

The application is configured for deployment at `rodan-app.lfwebinnovations.com.br` with automatic SSL via Traefik and Let's Encrypt.
