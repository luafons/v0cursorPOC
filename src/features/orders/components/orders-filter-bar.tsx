'use client'

import type { Client, Seller } from '../types/order'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePickerWithFormat } from '@/shared/components/date-picker-with-format'

interface OrdersFilterBarProps {
  clients: Client[]
  onFilterChange: (filters: {
    search: string
    client: string
    seller: string
    startDate: Date | undefined
    endDate: Date | undefined
    includeCancelledRejected: boolean
    status: string
  }) => void
  sellers: Seller[]
}

export function OrdersFilterBar({ clients, sellers, onFilterChange }: OrdersFilterBarProps) {
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState('Todos')
  const [selectedSeller, setSelectedSeller] = useState('Todos')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [includeCancelledRejected, setIncludeCancelledRejected] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('Todos (activos)')

  const handleFilter = () => {
    onFilterChange({
      search,
      client: selectedClient,
      seller: selectedSeller,
      startDate,
      endDate,
      includeCancelledRejected,
      status: selectedStatus,
    })
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedClient('Todos')
    setSelectedSeller('Todos')
    setStartDate(undefined)
    setEndDate(undefined)
    setIncludeCancelledRejected(false)
    setSelectedStatus('Todos (activos)')
    onFilterChange({
      search: '',
      client: 'Todos',
      seller: 'Todos',
      startDate: undefined,
      endDate: undefined,
      includeCancelledRejected: false,
      status: 'Todos (activos)',
    })
  }

  const statusOptions = [
    'Todos (activos)',
    'Pendiente',
    'En revisión',
    'Procesado',
    'Preparado',
    'Despachado',
    'Rechazado',
    'Anulado',
  ]

  return (
    <div className='bg-card p-6 rounded-lg shadow-sm mb-6 border border-border'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end'>
        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-foreground' htmlFor='search'>
            Buscar Pedido/Tango
          </label>
          <Input
            id='search'
            onChange={(e) => setSearch(e.target.value)}
            placeholder='N°...'
            value={search}
          />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-foreground' htmlFor='client'>
            Cliente
          </label>
          <Select onValueChange={setSelectedClient} value={selectedClient}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Seleccionar Cliente' />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-foreground' htmlFor='seller'>
            Vendedor
          </label>
          <Select onValueChange={setSelectedSeller} value={selectedSeller}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Seleccionar Vendedor' />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.name}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-foreground' htmlFor='status'>
            Estado
          </label>
          <Select onValueChange={setSelectedStatus} value={selectedStatus}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Seleccionar Estado' />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-foreground' htmlFor='startDate'>
            Desde
          </label>
          <DatePickerWithFormat date={startDate} placeholder='dd/mm/aaaa' setDate={setStartDate} />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-foreground' htmlFor='endDate'>
            Hasta
          </label>
          <DatePickerWithFormat date={endDate} placeholder='dd/mm/aaaa' setDate={setEndDate} />
        </div>

        <div className='flex items-center space-x-2 self-end'>
          <Checkbox
            checked={includeCancelledRejected}
            id='includeCancelledRejected'
            onCheckedChange={(checked) => setIncludeCancelledRejected(Boolean(checked))}
          />
          <label
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground'
            htmlFor='includeCancelledRejected'
          >
            Incluir Anulados/Rechazados
          </label>
        </div>

        <div className='flex justify-end space-x-2 self-end'>
          <Button onClick={handleClearFilters} variant='outline'>
            Limpiar Filtros
          </Button>
          <Button onClick={handleFilter}>Aplicar Filtros</Button>
        </div>
      </div>
    </div>
  )
}
