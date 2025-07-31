'use client'

import { ChevronDown } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/shared/contexts/app-context'

export function Header() {
  const { state } = useApp()

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>{state.currentModule}</h1>
        </div>

        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-600'>Simular como:</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center space-x-2' variant='ghost'>
                <span className='text-sm font-medium'>
                  {state.user?.name} ({state.user?.role})
                </span>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>Admin</DropdownMenuItem>
              <DropdownMenuItem>Administración</DropdownMenuItem>
              <DropdownMenuItem>Vendedor</DropdownMenuItem>
              <DropdownMenuItem>Depósito</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='p-0' variant='ghost'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage alt={state.user?.name} src='/placeholder.svg?height=32&width=32' />
                  <AvatarFallback>
                    {state.user?.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>Cambiar Usuario</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
