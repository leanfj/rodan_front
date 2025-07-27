// Extensões do authStore para trabalhar com sistema Tenant + Role
import {
  getTenantFromEmail,
  getTenantConfig,
  getRoleConfig,
  type TenantConfig,
  type RoleConfig,
} from '@/config/tenant-config'
import { useAuthStore } from './authStore'

// Funções utilitárias para o sistema de autenticação
const authStoreExtensions = {
  // Função para obter configuração do tenant atual baseado no email
  getTenantConfig: (): TenantConfig => {
    const state = useAuthStore.getState()
    if (!state.auth.user) {
      return getTenantConfig('default')
    }

    const tenantKey = getTenantFromEmail(state.auth.user.email)
    return getTenantConfig(tenantKey)
  },

  // Função para obter configuração do role atual
  getRoleConfig: (): RoleConfig => {
    const state = useAuthStore.getState()
    if (!state.auth.user) {
      return getRoleConfig('guest', 'default')
    }

    const tenantKey = getTenantFromEmail(state.auth.user.email)
    const userRole = state.auth.user.roles[0]?.toLowerCase() || 'user'
    return getRoleConfig(userRole, tenantKey)
  },

  // Função para verificar se o usuário tem uma permissão específica
  hasPermission: (permission: string): boolean => {
    const roleConfig = authStoreExtensions.getRoleConfig()
    return roleConfig.permissions.includes(permission)
  },

  // Função para verificar se o usuário pode acessar área administrativa
  canAccessAdmin: (): boolean => {
    const roleConfig = authStoreExtensions.getRoleConfig()
    return roleConfig.canAccessAdmin || false
  },

  // Função para verificar se o usuário tem acesso a um menu específico
  hasMenuAccess: (menuGroup: string, menuItem: string): boolean => {
    const roleConfig = authStoreExtensions.getRoleConfig()
    const allowedGroups = roleConfig.allowedNavGroups
    const allowedItems = roleConfig.allowedMenuItems[menuGroup] || []

    return allowedGroups.includes(menuGroup) && allowedItems.includes(menuItem)
  },

  // Função para verificar se uma feature está habilitada no tenant
  isFeatureEnabled: (
    feature: 'enableChats' | 'enableTasks' | 'enableUsers' | 'enableApps'
  ): boolean => {
    const tenantConfig = authStoreExtensions.getTenantConfig()
    return tenantConfig.customizations.features?.[feature] !== false
  },

  // Função para obter informações do tenant atual
  getTenantInfo: () => {
    const state = useAuthStore.getState()
    if (!state.auth.user) {
      return {
        tenantKey: 'default',
        tenantName: 'Default Organization',
        domain: 'localhost',
        userRole: 'guest',
      }
    }

    const tenantKey = getTenantFromEmail(state.auth.user.email)
    const tenantConfig = getTenantConfig(tenantKey)
    const userRole = state.auth.user.roles[0]?.toLowerCase() || 'user'

    return {
      tenantKey,
      tenantName: tenantConfig.name,
      domain: tenantConfig.domain,
      userRole,
    }
  },
}

// Hook para usar as funções estendidas
export const useAuthExtensions = () => authStoreExtensions

// Exemplo de uso em componentes:
/*
import { useAuthExtensions } from '@/stores/authStore.extensions'

function SomeComponent() {
  const { hasPermission, hasMenuAccess } = useAuthExtensions()
  
  const canEditUsers = hasPermission('users:edit')
  const canSeeUserMenu = hasMenuAccess('General', 'Users')
  
  return (
    <div>
      {canSeeUserMenu && <UserMenuComponent />}
      {canEditUsers && <EditUserButton />}
    </div>
  )
}
*/
