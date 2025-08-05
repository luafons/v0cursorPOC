'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ClientsTable } from '@/features/clients/components/clients-table'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AppProvider } from '@/shared/contexts/app-context'

export default function ClientsPage() {
  return (
    <AppProvider>
      <DashboardLayout>
        <div className='flex justify-end mb-4 space-x-2'>
          <Button variant='outline'>Reporte PDF</Button>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Nuevo Cliente
          </Button>
        </div>
        <ClientsTable />
      </DashboardLayout>
    </AppProvider>
  )
}
