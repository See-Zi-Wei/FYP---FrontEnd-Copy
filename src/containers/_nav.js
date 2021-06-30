const _nav = {
  Projects: [
    {
      _tag: 'CSidebarNavTitle',
      _children: ['PROJECTS']
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Active Projects',
      to: '/activeProjects',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Archived Projects',
      to: '/archivedProjects',
      icon: 'cil-chevron-right',
    },
  ],
  Project: [
    {
      _tag: 'CSidebarNavTitle',
      _children: ['PROJECT CONTENTS']
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Overview',
      to: '/projectOverview',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Assets',
      to: '',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Shots',
      to: '',
      icon: 'cil-chevron-right',
    },
  ],
  AssetLibrary: [
    {
      _tag: 'CSidebarNavTitle',
      _children: ['SEARCH ASSETS']
    },
  ],
  Afterburner: [
    {
      _tag: 'CSidebarNavTitle',
      _children: ['AFTERBURNER']
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Render Jobs',
      to: '/renderJobs',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Comp Jobs',
      to: '/compJobs',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Hosts',
      to: '/renderHosts',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Host Licenses',
      to: '/renderHostLicenses',
      icon: 'cil-chevron-right',
    },
  ],
  Users: [
    {
      _tag: 'CSidebarNavTitle',
      _children: ['USERS']
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Active Users',
      to: '/activeUsers',
      icon: 'cil-chevron-right',
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Inactive Users',
      to: '/inactiveUsers',
      icon: 'cil-chevron-right',
    },
  ],
  Dashboard: [
    {
      _tag: 'CSidebarNavTitle',
      _children: ['DASHBOARD']
    },
  ]
}

export default _nav
