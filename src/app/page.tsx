'use client'

import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AppProvider } from '@/shared/contexts/app-context'

export default function HomePage() {
  return (
    <AppProvider>
      <DashboardLayout>
        <div className='space-y-6'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-semibold mb-4'>Bienvenido a Tecnoplant</h2>
            <p className='text-gray-600'>Selecciona un módulo del menú lateral para comenzar.</p>
          </div>
        </div>
      </DashboardLayout>
    </AppProvider>
  )
}
