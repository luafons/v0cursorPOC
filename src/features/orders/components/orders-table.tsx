'use client'

import type { Order, OrderStatus } from '../types/order'

import { useState } from 'react'

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

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [openModal, setOpenModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Procesado':
      case 'Pendiente':
      case 'En revisión':
        return 'secondary' // Amarillo claro para estos estados
      case 'Preparado':
      case 'Despachado':
        return 'default' // Verde para estados positivos
      case 'Rechazado':
      case 'Anulado':
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

    if (order.status === 'Procesado') {
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
    } else if (order.status === 'Pendiente') {
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
    } else if (order.status === 'En revisión') {
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
            <TableHead>Nro Pedido</TableHead>
            <TableHead>Razón Social</TableHead>
            <TableHead>Tipo Cliente</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Nro en Tango</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Plazo</TableHead>
            <TableHead>Comentarios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className='text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='font-medium'>{order.orderNumber}</TableCell>
                <TableCell>{order.businessName}</TableCell>
                <TableCell>{order.clientType}</TableCell>
                <TableCell>{order.seller}</TableCell>
                <TableCell>{order.tangoNumber || '-'}</TableCell>
                <TableCell>{order.creationDate}</TableCell>
                <TableCell>${order.amount.toFixed(2)}</TableCell>
                <TableCell>{order.termDays} días</TableCell>
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
