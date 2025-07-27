import { useMemo } from 'react'
import {
  getTenantFromEmail,
  getTenantConfig,
  getRoleConfig,
  filterMenusByTenantFeatures,
} from '@/config/tenant-config'
import { useAuthStore } from '@/stores/authStore'
import { sidebarData as baseSidebarData } from '@/components/layout/data/sidebar-data'
import { type SidebarData } from '@/components/layout/types'

export function useSidebarData(): SidebarData {
  const { auth } = useAuthStore()

  return useMemo(() => {
    // Se não há usuário logado, retorna configuração de guest
    if (!auth.user) {
      const guestTenantConfig = getTenantConfig('default')

      return {
        user: {
          name: 'Guest',
          email: 'guest@example.com',
          avatar: '/avatars/default.jpg',
        },
        teams: guestTenantConfig.teamInfo,
        navGroups: [],
      }
    }

    // Determina o tenant baseado no domínio do email
    const tenantKey = getTenantFromEmail(auth.user.email)
    const tenantConfig = getTenantConfig(tenantKey)

    // Determina o role (primeiro role da lista, ou 'user' como padrão)
    const userRole = auth.user.roles[0]?.toLowerCase() || 'user'
    const roleConfig = getRoleConfig(userRole, tenantKey)

    // Filtra os grupos de navegação baseado no role e tenant
    const filteredNavGroups = baseSidebarData.navGroups
      .filter((group) => roleConfig.allowedNavGroups.includes(group.title))
      .map((group) => {
        let allowedItems = roleConfig.allowedMenuItems[group.title] || []

        // Aplica filtros baseados nas features habilitadas do tenant
        allowedItems = filterMenusByTenantFeatures(allowedItems, tenantConfig)

        return {
          ...group,
          items: group.items.filter((item) =>
            allowedItems.includes(item.title)
          ),
        }
      })
      .filter((group) => group.items.length > 0)

    return {
      user: {
        name: auth.user.userName,
        email: auth.user.email,
        avatar: `/avatars/${auth.user.login}.jpg`,
      },
      teams: tenantConfig.teamInfo,
      navGroups: filteredNavGroups,
    }
  }, [auth.user])
}

// Hook para obter customizações do tenant
export function useTenantCustomizations() {
  const { auth } = useAuthStore()

  return useMemo(() => {
    if (!auth.user) {
      return getTenantConfig('default').customizations
    }

    const tenantKey = getTenantFromEmail(auth.user.email)
    const tenantConfig = getTenantConfig(tenantKey)

    return tenantConfig.customizations
  }, [auth.user])
}

// Hook para obter informações do tenant atual
export function useTenantInfo() {
  const { auth } = useAuthStore()

  return useMemo(() => {
    if (!auth.user) {
      return {
        tenantKey: 'default',
        tenantName: 'Default Organization',
        userRole: 'guest',
      }
    }

    const tenantKey = getTenantFromEmail(auth.user.email)
    const tenantConfig = getTenantConfig(tenantKey)
    const userRole = auth.user.roles[0]?.toLowerCase() || 'user'

    return {
      tenantKey,
      tenantName: tenantConfig.name,
      userRole,
      domain: tenantConfig.domain,
    }
  }, [auth.user])
}

// Hook para verificar permissões
export function usePermissions() {
  const { auth } = useAuthStore()

  return useMemo(() => {
    if (!auth.user) {
      return {
        permissions: [],
        hasPermission: () => false,
        canAccessAdmin: false,
      }
    }

    const tenantKey = getTenantFromEmail(auth.user.email)
    const userRole = auth.user.roles[0]?.toLowerCase() || 'user'
    const roleConfig = getRoleConfig(userRole, tenantKey)

    return {
      permissions: roleConfig.permissions,
      hasPermission: (permission: string) =>
        roleConfig.permissions.includes(permission),
      canAccessAdmin: roleConfig.canAccessAdmin || false,
    }
  }, [auth.user])
}
