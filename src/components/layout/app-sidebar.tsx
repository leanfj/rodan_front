import {
  useSidebarData,
  useTenantCustomizations,
} from '@/hooks/use-sidebar-data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarData = useSidebarData()
  const customizations = useTenantCustomizations()

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      {!customizations.hideTeamSwitcher && (
        <SidebarHeader>
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
      )}
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {!customizations.hideUserMenu && (
        <SidebarFooter>
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
