'use client'

import { useState, useMemo } from 'react'

import { parse, isBefore, isAfter, isValid } from 'date-fns'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { OrdersFilterBar } from '@/features/orders/components/orders-filter-bar'
import { OrdersTable } from '@/features/orders/components/orders-table'
import { mockClients, mockOrders, mockSellers } from '@/features/orders/data/mock-data'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AppProvider } from '@/shared/contexts/app-context'

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    search: '',
    client: 'Todos',
    seller: 'Todos',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    includeCancelledRejected: false,
    status: 'Todos (activos)',
  })

  const filteredOrders = useMemo(() => {
    let currentOrders = [...mockOrders]

    // Filter by includeCancelledRejected
    if (!filters.includeCancelledRejected) {
      currentOrders = currentOrders.filter(
        (order) => order.status !== 'Anulado' && order.status !== 'Rechazado',
      )
    }

    // Filter by search (Order Number or Tango Number)
    if (filters.search) {
      const lowerCaseSearch = filters.search.toLowerCase()

      currentOrders = currentOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(lowerCaseSearch) ||
          order.tangoNumber?.toLowerCase().includes(lowerCaseSearch),
      )
    }

    // Filter by client
    if (filters.client !== 'Todos') {
      currentOrders = currentOrders.filter((order) => order.businessName === filters.client)
    }

    // Filter by seller
    if (filters.seller !== 'Todos') {
      currentOrders = currentOrders.filter((order) => order.seller === filters.seller)
    }

    // Filter by status
    if (filters.status !== 'Todos (activos)') {
      currentOrders = currentOrders.filter((order) => order.status === filters.status)
    } else {
      // If "Todos (activos)" is selected, ensure only active statuses are shown
      if (!filters.includeCancelledRejected) {
        currentOrders = currentOrders.filter(
          (order) => order.status !== 'Anulado' && order.status !== 'Rechazado',
        )
      }
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      currentOrders = currentOrders.filter((order) => {
        const orderDate = parse(order.creationDate, 'dd/MM/yyyy', new Date())

        if (!isValid(orderDate)) return false

        let matchesStartDate = true

        if (filters.startDate) {
          matchesStartDate = !isBefore(orderDate, filters.startDate)
        }

        let matchesEndDate = true

        if (filters.endDate) {
          matchesEndDate = !isAfter(orderDate, filters.endDate)
        }

        return matchesStartDate && matchesEndDate
      })
    }

    // Sort by creation date (oldest to newest)
    currentOrders.sort((a, b) => {
      const dateA = parse(a.creationDate, 'dd/MM/yyyy', new Date())
      const dateB = parse(b.creationDate, 'dd/MM/yyyy', new Date())

      return dateA.getTime() - dateB.getTime()
    })

    return currentOrders
  }, [filters])

  return (
    <AppProvider>
      <DashboardLayout>
        <div className='flex justify-end mb-4 space-x-2'>
          <Button variant='outline'>Descargar PDF</Button>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Nuevo Pedido
          </Button>
        </div>
        <OrdersFilterBar clients={mockClients} onFilterChange={setFilters} sellers={mockSellers} />
        <OrdersTable orders={filteredOrders} />
      </DashboardLayout>
    </AppProvider>
  )
}
