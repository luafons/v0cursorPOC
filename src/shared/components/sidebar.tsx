'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Package,
  ShoppingCart,
  Users,
  Newspaper,
  Building2,
  History,
  Settings,
  DollarSign,
  Warehouse,
  FileText,
  Calculator,
  Percent,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/app-context'
import type { NavigationItem } from '@/shared/types'

const navigationItems: NavigationItem[] = [
  {
    id: 'commercial',
    label: 'COMERCIAL',
    icon: '',
    path: '',
    children: [
      { id: 'news', label: 'Novedades', icon: 'Newspaper', path: '/news' },
      {
        id: 'visit-history',
        label: 'Historial de Visitas',
        icon: 'History',
        path: '/visit-history',
      },
    ],
  },
  {
    id: 'management',
    label: 'GESTIÓN',
    icon: '',
    path: '',
    children: [
      { id: 'users', label: 'Usuarios', icon: 'Users', path: '/users' },
      { id: 'clients', label: 'Clientes', icon: 'Building2', path: '/clients' },
      { id: 'products', label: 'Productos', icon: 'Package', path: '/products' },
      { id: 'orders', label: 'Pedidos', icon: 'ShoppingCart', path: '/orders' },
    ],
  },
  {
    id: 'finance',
    label: 'FINANZAS',
    icon: '',
    path: '',
    children: [
      {
        id: 'collection-management',
        label: 'Gestión de Cobros',
        icon: 'DollarSign',
        path: '/collection-management',
      },
      {
        id: 'current-account',
        label: 'Cuenta Corriente',
        icon: 'CreditCard',
        path: '/current-account',
      },
    ],
  },
  {
    id: 'warehouse',
    label: 'DEPÓSITO',
    icon: '',
    path: '',
    children: [
      {
        id: 'stock-management',
        label: 'Gestión de Stock',
        icon: 'Warehouse',
        path: '/stock-management',
      },
      {
        id: 'warehouse-management',
        label: 'ABM Depósitos',
        icon: 'Warehouse',
        path: '/warehouse-management',
      },
    ],
  },
  {
    id: 'parameters',
    label: 'PARÁMETROS',
    icon: '',
    path: '',
    children: [
      { id: 'client-type', label: 'Tipo de Cliente', icon: 'Users', path: '/client-type' },
      { id: 'segment', label: 'Segmento', icon: 'BarChart3', path: '/segment' },
      { id: 'technology', label: 'Tecnología', icon: 'Settings', path: '/technology' },
      { id: 'presentation', label: 'Presentación', icon: 'Package', path: '/presentation' },
      { id: 'brand', label: 'Marca', icon: 'FileText', path: '/brand' },
      { id: 'price-list', label: 'Lista de precios', icon: 'DollarSign', path: '/price-list' },
      { id: 'vat-condition', label: 'Condición IVA', icon: 'Percent', path: '/vat-condition' },
      { id: 'vat', label: 'IVA', icon: 'Calculator', path: '/vat' },
      { id: 'atm', label: 'ATM', icon: 'CreditCard', path: '/atm' },
      { id: 'tax-rates', label: 'Alícuotas', icon: 'Percent', path: '/tax-rates' },
      { id: 'surcharge', label: 'Recargo', icon: 'DollarSign', path: '/surcharge' },
    ],
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  ShoppingCart,
  Users,
  Newspaper,
  Building2,
  History,
  Settings,
  DollarSign,
  Warehouse,
  FileText,
  Calculator,
  Percent,
  CreditCard,
  BarChart3,
}

export function Sidebar() {
  const pathname = usePathname()
  const { state, setCurrentModule, toggleSidebar } = useApp()
  const { sidebarCollapsed } = state ?? {}

  const handleNavigation = (label: string) => {
    setCurrentModule(label)
  }

  // Obtener todos los items de navegación en una lista plana
  const allNavItems = navigationItems.flatMap((section) => section.children ?? [])

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'bg-[#1a5f3f] text-white flex flex-col transition-all duration-300 h-full',
          sidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'border-b border-green-600 flex items-center justify-center flex-shrink-0',
            sidebarCollapsed ? 'p-3' : 'p-4',
          )}
        >
          {sidebarCollapsed ? (
            <div className='w-8 h-8 bg-white rounded flex items-center justify-center'>
              <Package className='h-5 w-5 text-[#1a5f3f]' />
            </div>
          ) : (
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-white rounded flex items-center justify-center'>
                <Package className='h-5 w-5 text-[#1a5f3f]' />
              </div>
              <span className='font-bold text-lg'>Tecnoplant</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className='flex-1 overflow-hidden'>
          <nav className='py-4 px-4'>
            {sidebarCollapsed ? (
              // Vista colapsada - solo iconos
              <div className='flex flex-col items-center space-y-2'>
                {allNavItems.map((item) => {
                  const Icon = iconMap[item.icon] ?? Package
                  const isActive = pathname === item.path

                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Link
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded transition-colors',
                            isActive
                              ? 'bg-green-600 text-white'
                              : 'text-green-100 hover:bg-green-600 hover:text-white',
                          )}
                          href={item.path}
                          onClick={() => handleNavigation(item.label)}
                        >
                          <Icon className='h-5 w-5' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className='ml-2' side='right'>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ) : (
              // Vista expandida - con secciones y texto
              navigationItems.map((section) => (
                <div className='mb-6' key={section.id}>
                  <div className='mb-3'>
                    <span className='text-xs font-semibold text-green-200 uppercase tracking-wider'>
                      {section.label}
                    </span>
                  </div>

                  {section.children ? (
                    <div className='space-y-1'>
                      {section.children.map((item) => {
                        const Icon = iconMap[item.icon] ?? Package
                        const isActive = pathname === item.path

                        return (
                          <Link
                            className={cn(
                              'flex items-center space-x-3 px-4 py-3 text-sm transition-colors rounded',
                              isActive
                                ? 'bg-green-600 text-white'
                                : 'text-green-100 hover:bg-green-600 hover:text-white',
                            )}
                            href={item.path}
                            key={item.id}
                            onClick={() => handleNavigation(item.label)}
                          >
                            <Icon className='h-4 w-4 flex-shrink-0' />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </nav>
        </ScrollArea>

        {/* Collapse Button */}
        <div
          className={cn(
            'border-t border-green-600 flex-shrink-0',
            sidebarCollapsed ? 'p-2' : 'p-4',
          )}
        >
          <button
            className={cn(
              'flex items-center text-green-100 hover:text-white text-sm transition-colors',
              sidebarCollapsed ? 'justify-center w-full' : 'space-x-2',
            )}
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className='h-4 w-4' />
            ) : (
              <>
                <ChevronLeft className='h-4 w-4' />
                <span>Colapsar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
