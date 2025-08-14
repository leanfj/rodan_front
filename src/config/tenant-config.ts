import { Command, GalleryVerticalEnd, AudioWaveform } from 'lucide-react'

// Configuração de Role - define permissões por nível de acesso
export interface RoleConfig {
  allowedNavGroups: string[]
  allowedMenuItems: Record<string, string[]>
  permissions: string[]
  canAccessAdmin?: boolean
}

// Configuração de Tenant - define customizações por cliente/organização
export interface TenantConfig {
  name: string
  domain: string
  teamInfo: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
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
      enableAdministracao?: boolean
    }
  }
  roleOverrides?: Partial<Record<string, Partial<RoleConfig>>>
}

// Configurações de Role (nível de acesso dentro da organização)
export const roleConfigs: Record<string, RoleConfig> = {
  admin: {
    allowedNavGroups: ['General', 'Pages', 'Other', 'Administração'],
    allowedMenuItems: {
      General: ['Dashboard', 'Tasks', 'Apps', 'Chats', 'Users'],
      Pages: ['Auth', 'Errors'],
      Other: ['Settings', 'Help Center'],
      ['Administração']: ['Cadastros'],
    },
    permissions: ['read', 'write', 'delete', 'admin', 'manage_users'],
    canAccessAdmin: true,
  },
  manager: {
    allowedNavGroups: ['General', 'Other'],
    allowedMenuItems: {
      General: ['Dashboard', 'Tasks', 'Apps', 'Chats', 'Users'],
      Other: ['Settings'],
    },
    permissions: ['read', 'write', 'manage_users'],
    canAccessAdmin: false,
  },
  user: {
    allowedNavGroups: ['General', 'Other'],
    allowedMenuItems: {
      General: ['Dashboard', 'Tasks', 'Apps', 'Chats'],
      Other: ['Settings'],
    },
    permissions: ['read', 'write'],
    canAccessAdmin: false,
  },
  readonly: {
    allowedNavGroups: ['General'],
    allowedMenuItems: {
      General: ['Dashboard'],
    },
    permissions: ['read'],
    canAccessAdmin: false,
  },
  guest: {
    allowedNavGroups: ['General'],
    allowedMenuItems: {
      General: ['Dashboard'],
    },
    permissions: ['read'],
    canAccessAdmin: false,
  },
}

// Configurações por Tenant (cliente/organização)
export const tenantConfigs: Record<string, TenantConfig> = {
  // Exemplo: Empresa Rodan
  rodan: {
    name: 'ABC Corporation',
    domain: 'rodan.com',
    teamInfo: [
      {
        name: 'ABC Corp Team',
        logo: Command,
        plan: 'Enterprise',
      },
    ],
    customizations: {
      hideUserMenu: false,
      hideTeamSwitcher: false,
      customBranding: {
        primaryColor: '#ff0263ff',
        companyName: 'ABC Corporation',
      },
      features: {
        enableChats: true,
        enableTasks: true,
        enableUsers: true,
        enableApps: true,
        enableAdministracao: true,
      },
    },
  },
  // Exemplo: Startup XYZ
  'xyz-startup': {
    name: 'XYZ Startup',
    domain: 'xyz.com',
    teamInfo: [
      {
        name: 'XYZ Team',
        logo: GalleryVerticalEnd,
        plan: 'Startup',
      },
    ],
    customizations: {
      hideUserMenu: false,
      hideTeamSwitcher: true,
      customBranding: {
        primaryColor: '#3b82f6',
        companyName: 'XYZ Startup',
      },
      features: {
        enableChats: false,
        enableTasks: true,
        enableUsers: false,
        enableApps: true,
        enableAdministracao: true,
      },
    },
    // Override para este tenant: users não podem ver Apps
    roleOverrides: {
      user: {
        allowedMenuItems: {
          General: ['Dashboard', 'Tasks'],
        },
      },
    },
  },
  // Tenant padrão para desenvolvimento/fallback
  default: {
    name: 'Default Organization',
    domain: 'localhost',
    teamInfo: [
      {
        name: 'Development Team',
        logo: AudioWaveform,
        plan: 'Development',
      },
    ],
    customizations: {
      hideUserMenu: false,
      hideTeamSwitcher: false,
      features: {
        enableChats: true,
        enableTasks: true,
        enableUsers: true,
        enableApps: true,
        enableAdministracao: true,
      },
    },
  },
}

// Função para extrair tenant do email
export function getTenantFromEmail(email: string): string {
  const domain = email.split('@')[1]

  // Procura por tenant baseado no domínio
  for (const [tenantKey, config] of Object.entries(tenantConfigs)) {
    if (config.domain === domain) {
      return tenantKey
    }
  }

  // Retorna tenant padrão se não encontrar
  return 'default'
}

// Função para obter configuração do tenant
export function getTenantConfig(tenantKey: string): TenantConfig {
  return tenantConfigs[tenantKey] || tenantConfigs.default
}

// Função para obter configuração do role com possíveis overrides do tenant
export function getRoleConfig(role: string, tenantKey: string): RoleConfig {
  const baseRoleConfig = roleConfigs[role] || roleConfigs.guest
  const tenantConfig = getTenantConfig(tenantKey)

  // Aplica overrides do tenant se existirem
  if (tenantConfig.roleOverrides?.[role]) {
    return {
      ...baseRoleConfig,
      ...tenantConfig.roleOverrides[role],
      allowedMenuItems: {
        ...baseRoleConfig.allowedMenuItems,
        ...tenantConfig.roleOverrides[role].allowedMenuItems,
      },
    }
  }

  return baseRoleConfig
}

// Função para filtrar menus baseado nas features habilitadas do tenant
export function filterMenusByTenantFeatures(
  menuItems: string[],
  tenantConfig: TenantConfig
): string[] {
  const features = tenantConfig.customizations.features
  if (!features) return menuItems

  return menuItems.filter((item) => {
    switch (item) {
      case 'Chats':
        return features.enableChats !== false
      case 'Tasks':
        return features.enableTasks !== false
      case 'Users':
        return features.enableUsers !== false
      case 'Apps':
        return features.enableApps !== false
      case 'Administração':
        return features.enableAdministracao !== false
      default:
        return true
    }
  })
}
