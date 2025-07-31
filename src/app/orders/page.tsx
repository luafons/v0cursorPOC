'use client'

import { useState, useMemo } from 'react'

import { isBefore, isAfter, isValid } from 'date-fns'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { OrdersFilterBar } from '@/features/orders/components/orders-filter-bar'
import { OrdersTable } from '@/features/orders/components/orders-table'
import { mockClients, mockSellers } from '@/features/orders/data/mock-data'
import { type Order } from '@/features/orders/types/order'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { AppProvider } from '@/shared/contexts/app-context'
import { useQuery } from '@tanstack/react-query'
import { parseDate } from '@/lib/utils'

interface OrdersResponse {
  orders: Order[]
}

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

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders')
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    },
  })

  const filteredOrders = useMemo(() => {
    // Use API data if available, otherwise fallback to empty array
    let currentOrders = ordersData?.orders || []

    // Filter by includeCancelledRejected
    if (!filters.includeCancelledRejected) {
      currentOrders = currentOrders.filter(
        (order) => 
          order.status.toLowerCase() !== 'anulado' && 
          order.status.toLowerCase() !== 'rechazado',
      )
    }

    // Filter by search (Order Number or Tango Number)
    if (filters.search) {
      const lowerCaseSearch = filters.search.toLowerCase()

      currentOrders = currentOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(lowerCaseSearch) ||
          order.tangoOrderNumber?.toLowerCase().includes(lowerCaseSearch),
      )
    }

    // Filter by client
    if (filters.client !== 'Todos') {
      currentOrders = currentOrders.filter((order) => order.customerName === filters.client)
    }

    // Filter by seller
    if (filters.seller !== 'Todos') {
      currentOrders = currentOrders.filter((order) => order.sellerName === filters.seller)
    }

    // Filter by status
    if (filters.status !== 'Todos (activos)') {
      currentOrders = currentOrders.filter((order) => 
        order.status.toLowerCase() === filters.status.toLowerCase()
      )
    } else {
      // If "Todos (activos)" is selected, ensure only active statuses are shown
      if (!filters.includeCancelledRejected) {
        currentOrders = currentOrders.filter(
          (order) => 
            order.status.toLowerCase() !== 'anulado' && 
            order.status.toLowerCase() !== 'rechazado',
        )
      }
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      currentOrders = currentOrders.filter((order) => {
        const orderDate = parseDate(order.date)

        if (!isValid(orderDate)) return false

        let matchesStartDate = true
        let matchesEndDate = true

        if (filters.startDate) {
          // La fecha del pedido debe ser mayor o igual a la fecha de inicio
          matchesStartDate = orderDate >= filters.startDate
        }

        if (filters.endDate) {
          // La fecha del pedido debe ser menor o igual a la fecha de fin
          // Ajustamos la fecha de fin para incluir todo el día
          const endOfDay = new Date(filters.endDate)
          endOfDay.setHours(23, 59, 59, 999)
          matchesEndDate = orderDate <= endOfDay
        }

        // Debug: Log para verificar el filtrado de fechas
        if (order.orderNumber === '1008') { // Ejemplo con una fecha específica
          console.log('Filtro de fechas:', {
            orderNumber: order.orderNumber,
            orderDate: order.date,
            parsedOrderDate: orderDate,
            startDate: filters.startDate,
            endDate: filters.endDate,
            endOfDay: filters.endDate ? new Date(filters.endDate).setHours(23, 59, 59, 999) : null,
            matchesStartDate,
            matchesEndDate,
            finalResult: matchesStartDate && matchesEndDate
          })
        }

        return matchesStartDate && matchesEndDate
      })
    }

    // Sort by creation date (oldest to newest)
    currentOrders.sort((a, b) => {
      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)

      return dateA.getTime() - dateB.getTime()
    })

    return currentOrders
  }, [filters, ordersData])

  if (isLoading) {
    return (
      <AppProvider>
        <DashboardLayout>
          <div className='flex items-center justify-center h-64'>
            <div className='text-lg'>Cargando órdenes...</div>
          </div>
        </DashboardLayout>
      </AppProvider>
    )
  }

  if (error) {
    return (
      <AppProvider>
        <DashboardLayout>
          <div className='flex items-center justify-center h-64'>
            <div className='text-lg text-red-600'>Error al cargar las órdenes</div>
          </div>
        </DashboardLayout>
      </AppProvider>
    )
  }

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
