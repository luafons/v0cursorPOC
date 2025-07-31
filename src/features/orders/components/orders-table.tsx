'use client'

import type { Order, OrderStatus } from '../types/order'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

interface OrdersTableProps {
  orders: Order[]
}

type SortField = 'orderNumber' | 'customerName' | 'customerType' | 'sellerName' | 'tangoOrderNumber' | 'date' | 'totalAmount' | 'paymentTerm' | 'status'
type SortDirection = 'asc' | 'desc' | null

interface SortableHeaderProps {
  field: SortField
  currentSort: { field: SortField; direction: SortDirection }
  onSort: (field: SortField) => void
  children: React.ReactNode
}

function SortableHeader({ field, currentSort, onSort, children }: SortableHeaderProps) {
  const isActive = currentSort.field === field
  const direction = isActive ? currentSort.direction : null

  const getIcon = () => {
    if (!isActive) return <ChevronsUpDown className="h-4 w-4" />
    if (direction === 'asc') return <ChevronUp className="h-4 w-4" />
    if (direction === 'desc') return <ChevronDown className="h-4 w-4" />
    return <ChevronsUpDown className="h-4 w-4" />
  }

  return (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        <div className="flex items-center gap-1">
          {children}
          {getIcon()}
        </div>
      </Button>
    </TableHead>
  )
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [openModal, setOpenModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'date',
    direction: 'desc'
  })

  const handleSort = (field: SortField) => {
    setSortConfig(prev => {
      if (prev.field === field) {
        // Si es el mismo campo, cambiar dirección
        if (prev.direction === 'asc') return { field, direction: 'desc' }
        if (prev.direction === 'desc') return { field, direction: null }
        return { field, direction: 'asc' }
      }
      // Si es un campo diferente, empezar con asc
      return { field, direction: 'asc' }
    })
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.direction) return 0

    const { field, direction } = sortConfig
    let aValue: any = a[field]
    let bValue: any = b[field]

    // Manejo especial para diferentes tipos de datos
    if (field === 'date') {
      // Convertir fecha dd/mm/aaaa a objeto Date para comparación
      const [dayA, monthA, yearA] = aValue.split('/')
      const [dayB, monthB, yearB] = bValue.split('/')
      aValue = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA))
      bValue = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB))
    } else if (field === 'totalAmount' || field === 'paymentTerm') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    } else {
      // Para strings, convertir a minúsculas para comparación consistente
      aValue = String(aValue || '').toLowerCase()
      bValue = String(bValue || '').toLowerCase()
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })

  const getStatusBadgeVariant = (status: OrderStatus) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'procesado':
      case 'pendiente':
      case 'en revisión':
        return 'secondary' // Amarillo claro para estos estados
      case 'preparado':
      case 'despachado':
        return 'default' // Verde para estados positivos
      case 'rechazado':
      case 'anulado':
        return 'destructive' // Rojo para estados negativos
      default:
        return 'outline'
    }
  }

  const handleViewEdit = (order: Order) => {
    setSelectedOrder(order)
    setOpenModal(true)
  }

  const getActionButtons = (order: Order) => {
    const buttons = [
      <Button key='view-edit' onClick={() => handleViewEdit(order)} variant='link'>
        Ver/Editar
      </Button>,
    ]

    const statusLower = order.status.toLowerCase()

    if (statusLower === 'procesado') {
      buttons.push(
        <Button key='prepare' variant='default'>
          Preparar
        </Button>,
      )
      buttons.push(
        <Button key='cancel' variant='destructive'>
          Anular
        </Button>,
      )
    } else if (statusLower === 'pendiente') {
      buttons.push(
        <Button key='process' variant='default'>
          Procesar
        </Button>,
      )
      buttons.push(
        <Button key='cancel' variant='destructive'>
          Anular
        </Button>,
      )
    } else if (statusLower === 'en revisión') {
      buttons.push(
        <Button key='approve' variant='default'>
          Aprobar
        </Button>,
      )
      buttons.push(
        <Button key='reject' variant='destructive'>
          Rechazar
        </Button>,
      )
    }
    // For "Despachado", "Rechazado", "Anulado" only "Ver/Editar" is shown, which is already added.

    return buttons
  }

  return (
    <div className='bg-card p-6 rounded-lg shadow-sm border border-border'>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="orderNumber" currentSort={sortConfig} onSort={handleSort}>
              Nro Pedido
            </SortableHeader>
            <SortableHeader field="customerName" currentSort={sortConfig} onSort={handleSort}>
              Razón Social
            </SortableHeader>
            <SortableHeader field="customerType" currentSort={sortConfig} onSort={handleSort}>
              Tipo Cliente
            </SortableHeader>
            <SortableHeader field="sellerName" currentSort={sortConfig} onSort={handleSort}>
              Vendedor
            </SortableHeader>
            <SortableHeader field="tangoOrderNumber" currentSort={sortConfig} onSort={handleSort}>
              Nro en Tango
            </SortableHeader>
            <SortableHeader field="date" currentSort={sortConfig} onSort={handleSort}>
              Fecha
            </SortableHeader>
            <SortableHeader field="totalAmount" currentSort={sortConfig} onSort={handleSort}>
              Monto
            </SortableHeader>
            <SortableHeader field="paymentTerm" currentSort={sortConfig} onSort={handleSort}>
              Plazo
            </SortableHeader>
            <TableHead>Comentarios</TableHead>
            <SortableHeader field="status" currentSort={sortConfig} onSort={handleSort}>
              Estado
            </SortableHeader>
            <TableHead className='text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <TableRow key={order.orderNumber}> {/* revisar si es correcto el key (id?) */}
                <TableCell className='font-medium'>{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerType}</TableCell>
                <TableCell>{order.sellerName}</TableCell>
                <TableCell>{order.tangoOrderNumber || '-'}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>${(order.totalAmount as number).toFixed(2)}</TableCell>
                <TableCell>{order.paymentTerm} días</TableCell>
                <TableCell>{order.comments || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className='flex justify-end flex-nowrap space-x-2'>
                    {getActionButtons(order)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='h-24 text-center text-muted-foreground' colSpan={11}>
                No se encontraron pedidos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog onOpenChange={setOpenModal} open={openModal}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Detalles del Pedido {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p>Aquí se mostrarán los detalles completos del pedido.</p>
            <p className='text-sm text-muted-foreground mt-2'>Estado: {selectedOrder?.status}</p>
            {/* Más detalles del pedido aquí */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
