import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const ActiveProjects = React.lazy(() => import('./views/projects/ActiveProjects'));
const ArchivedProjects = React.lazy(() => import('./views/projects/ArchivedProjects'));
const Overview = React.lazy(() => import('./views/projects/project/Overview'));
const AssetSearch = React.lazy(() => import('./views/assetLibrary/AssetSearch'));
const RenderJobs = React.lazy(() => import('./views/afterburner/RenderJobs'));
const RenderFrames = React.lazy(() => import('./views/afterburner/RenderFrames'));
const CompJobs = React.lazy(() => import('./views/afterburner/CompJobs'));
const RenderHosts = React.lazy(() => import('./views/afterburner/RenderHosts'));
const HostLicenses = React.lazy(() => import('./views/afterburner/HostLicenses'));
const ActiveUsers = React.lazy(() => import('./views/users/ActiveUsers'));
const InactiveUsers = React.lazy(() => import('./views/users/InactiveUsers'));

// Rmb delete in the end
const test = React.lazy(() => import('./views/assetLibrary/test'));

const routes = [
  { path: '/', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/activeProjects', exact: true, name: 'Active Projects', component: ActiveProjects },
  { path: '/archivedProjects', exact: true, name: 'Archived Projects', component: ArchivedProjects },
  { path: '/projectOverview', exact: true, name: 'Project Overview', component: Overview },
  { path: '/assetSearch', exact: true, name: 'Search Assets', component: AssetSearch },
  { path: '/renderJobs', exact: true, name: 'Render Jobs', component: RenderJobs },
  { path: '/renderJobs/renderFrames', exact: true, name: "Render Frames for Job", component: RenderFrames },
  { path: '/compJobs', exact: true, name: 'Comp Jobs', component: CompJobs },
  { path: '/renderHosts', exact: true, name: 'Render Hosts', component: RenderHosts },
  { path: '/renderHostLicenses', exact: true, name: 'Host Licenses', component: HostLicenses },
  { path: '/activeUsers', exact: true, name: 'Active Users', component: ActiveUsers },
  { path: '/inactiveUsers', exact: true, name: 'Inactive Users', component: InactiveUsers },

  { path: '/test', exact: true, name: 'Search Assets', component: test },
];

export default routes;
