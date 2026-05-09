import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import AISourcing from '../pages/sourcing/AI'
import SupplierPool from '../pages/sourcing/Pool'
import SupplierCompare from '../pages/sourcing/Compare'
import DemandInsight from '../pages/sourcing/DemandInsight'
import IndustryChain from '../pages/sourcing/IndustryChain'
import OfficialSuppliers from '../pages/suppliers/Official'
import RiskAlerts from '../pages/risk/Alerts'
import RiskMap from '../pages/risk/RiskMap'
import Permissions from '../pages/settings/Permissions'
import SystemConfig from '../pages/settings/System'
import Profile from '../pages/Profile'
import AccountSettings from '../pages/settings/Account'
import NotificationSettings from '../pages/settings/Notifications'
import Notifications from '../pages/Notifications'
import SearchResults from '../pages/Search'
import Login from '../pages/Login'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'sourcing',
        children: [
          {
            path: 'ai',
            element: <AISourcing />,
          },
          {
            path: 'pool',
            element: <SupplierPool />,
          },
          {
            path: 'compare',
            element: <SupplierCompare />,
          },
          {
            path: 'insight',
            element: <DemandInsight />,
          },
          {
            path: 'chain',
            element: <IndustryChain />,
          },
          {
            path: 'list',
            element: <div>寻源记录列表</div>,
          },
          {
            path: 'detail/:id',
            element: <div>寻源详情</div>,
          },
        ],
      },
      {
        path: 'suppliers',
        children: [
          {
            path: 'official',
            element: <OfficialSuppliers />,
          },
          {
            path: 'detail/:id',
            element: <div>供应商详情</div>,
          },
        ],
      },
      {
        path: 'risk',
        children: [
          {
            path: 'alerts',
            element: <RiskAlerts />,
          },
          {
            path: 'map',
            element: <RiskMap />,
          },
          {
            path: 'detail/:id',
            element: <div>风险详情</div>,
          },
        ],
      },
      {
        path: 'contracts',
        children: [
          {
            path: 'detail/:id',
            element: <div>合同详情</div>,
          },
        ],
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        children: [
          {
            path: 'account',
            element: <AccountSettings />,
          },
          {
            path: 'notifications',
            element: <NotificationSettings />,
          },
          {
            path: 'permissions',
            element: <Permissions />,
          },
          {
            path: 'system',
            element: <SystemConfig />,
          },
        ],
      },
      {
        path: 'search',
        element: <SearchResults />,
      },
    ],
  },
])
