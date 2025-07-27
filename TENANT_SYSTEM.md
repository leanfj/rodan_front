# Sistema de Tenant e Role - Arquitetura Multi-Tenant

Este sistema implementa uma arquitetura multi-tenant onde:
- **Tenant**: Representa o cliente/organização (identificado pelo domínio do email)
- **Role**: Representa o nível de acesso dentro da organização (admin, manager, user, etc.)

## Conceitos Fundamentais

### 🏢 Tenant (Cliente/Organização)
- Identificado pelo domínio do email do usuário
- Define customizações visuais e features disponíveis
- Exemplo: `usuario@abc-corp.com` → tenant `abc-corp`

### 👤 Role (Nível de Acesso)
- Define permissões e menus acessíveis
- Aplicado dentro do contexto do tenant
- Exemplos: admin, manager, user, readonly, guest

## Estrutura dos Arquivos

### 1. Configuração (`/src/config/tenant-config.ts`)

#### RoleConfig
Define permissões por nível de acesso:
```typescript
export interface RoleConfig {
  allowedNavGroups: string[]
  allowedMenuItems: Record<string, string[]>
  permissions: string[]
  canAccessAdmin?: boolean
}
```

#### TenantConfig
Define customizações por cliente:
```typescript
export interface TenantConfig {
  name: string
  domain: string
  teamInfo: Array<{name: string, logo: React.ElementType, plan: string}>
  customizations: {
    hideUserMenu?: boolean
    hideTeamSwitcher?: boolean
    customBranding?: {
      primaryColor?: string
      logoUrl?: string
      companyName?: string
    }
    features?: {
      enableChats?: boolean
      enableTasks?: boolean
      enableUsers?: boolean
      enableApps?: boolean
    }
  }
  roleOverrides?: Partial<Record<string, Partial<RoleConfig>>>
}
```

### 2. Hooks (`/src/hooks/use-sidebar-data.tsx`)

- `useSidebarData()`: Dados filtrados do sidebar baseados em tenant + role
- `useTenantCustomizations()`: Customizações específicas do tenant
- `useTenantInfo()`: Informações do tenant atual
- `usePermissions()`: Verificação de permissões

### 3. Extensões do Auth (`/src/stores/authStore.extensions.ts`)

Funções utilitárias para verificação de permissões e acesso.

## Exemplos Práticos

### Configuração de Tenants

```typescript
// Empresa ABC Corporation
'abc-corp': {
  name: 'ABC Corporation',
  domain: 'abc-corp.com',
  teamInfo: [{ name: 'ABC Corp Team', logo: Command, plan: 'Enterprise' }],
  customizations: {
    features: {
      enableChats: true,
      enableTasks: true,
      enableUsers: true,
      enableApps: true,
    },
    customBranding: {
      primaryColor: '#1f2937',
      companyName: 'ABC Corporation',
    }
  }
}

// Startup XYZ (com limitações)
'xyz-startup': {
  name: 'XYZ Startup',
  domain: 'xyz.com',
  customizations: {
    features: {
      enableChats: false,  // Chats desabilitados
      enableUsers: false,  // Gestão de usuários desabilitada
    }
  },
  // Override: usuários não veem Apps
  roleOverrides: {
    user: {
      allowedMenuItems: {
        General: ['Dashboard', 'Tasks'], // Remove 'Apps'
      }
    }
  }
}
```

### Como o Sistema Funciona

1. **Login do Usuário**: `joao@abc-corp.com` com role `['manager']`

2. **Detecção do Tenant**: 
   - Extrai domínio: `abc-corp.com`
   - Encontra tenant: `abc-corp`

3. **Aplicação de Configurações**:
   - Carrega configurações do tenant `abc-corp`
   - Aplica permissões do role `manager`
   - Verifica overrides específicos do tenant

4. **Resultado**:
   - Menus filtrados por role
   - Features limitadas por tenant
   - Branding personalizado aplicado

### Uso em Componentes

```tsx
import { useAuthExtensions } from '@/stores/authStore.extensions'
import { useTenantInfo, usePermissions } from '@/hooks/use-sidebar-data'

function MyComponent() {
  const { hasMenuAccess, isFeatureEnabled } = useAuthExtensions()
  const { hasPermission } = usePermissions()
  const tenantInfo = useTenantInfo()
  
  const canSeeUsers = hasMenuAccess('General', 'Users')
  const canEditUsers = hasPermission('manage_users')
  const chatsEnabled = isFeatureEnabled('enableChats')
  
  return (
    <div>
      <h1>Bem-vindo à {tenantInfo.tenantName}</h1>
      {canSeeUsers && <UsersList />}
      {canEditUsers && <UserEditForm />}
      {chatsEnabled && <ChatWidget />}
    </div>
  )
}
```

## Cenários de Uso

### 1. Empresa Enterprise (abc-corp.com)
- **Admin**: Acesso total a todos os recursos
- **Manager**: Gestão de usuários e operações
- **User**: Acesso a recursos básicos

### 2. Startup (xyz.com)
- **Features limitadas**: Sem chats, sem gestão de usuários
- **Role override**: Users não veem Apps
- **Branding personalizado**

### 3. Cliente SaaS (cliente.com)
- **White-label**: Logo e cores personalizadas
- **Features por plano**: Basic vs Premium
- **Restrições específicas**

## Vantagens da Arquitetura

✅ **Separação clara** entre organização (tenant) e acesso (role)
✅ **Flexibilidade** para customizar por cliente
✅ **Escalabilidade** para múltiplos clientes
✅ **Overrides** para casos especiais
✅ **Branding** personalizado por tenant
✅ **Features toggles** por organização

## Próximos Passos

1. **API Integration**: Buscar configurações de uma API
2. **Caching**: Implementar cache das configurações
3. **Admin Panel**: Interface para gerenciar tenants
4. **Auditoria**: Log de ações por tenant/role
5. **Temas Dinâmicos**: CSS customizado por tenant
