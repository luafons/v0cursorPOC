'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'

import type { User, AppState } from '@/shared/types'

interface AppContextType {
  setCurrentModule: (module: string) => void
  setUser: (user: User | null) => void
  state: AppState
  toggleSidebar: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_MODULE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_CURRENT_MODULE':
      return { ...state, currentModule: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }
    default:
      return state
  }
}

const initialState: AppState = {
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@tecnoplant.com',
    role: 'Admin',
    isActive: true,
  },
  currentModule: 'Pedidos',
  sidebarCollapsed: false,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const setCurrentModule = (module: string) => {
    dispatch({ type: 'SET_CURRENT_MODULE', payload: module })
  }

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  return (
    <AppContext.Provider value={{ state, setUser, setCurrentModule, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }

  return context
}
