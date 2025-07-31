export interface User {
  email: string
  id: string
  isActive: boolean
  name: string
  role: 'Admin' | 'Administración' | 'Vendedor' | 'Depósito'
}

export interface NavigationItem {
  children?: NavigationItem[]
  icon: string
  id: string
  label: string
  path: string
}

export interface AppState {
  currentModule: string
  sidebarCollapsed: boolean
  user: User | null
}
