'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerWithFormatProps {
  date: Date | undefined
  placeholder: string
  setDate: (date: Date | undefined) => void
}

export function DatePickerWithFormat({ date, setDate, placeholder }: DatePickerWithFormatProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'w-[200px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
          variant='outline'
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'dd/MM/yyyy', { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar autoFocus locale={es} mode='single' onSelect={setDate} selected={date} />
      </PopoverContent>
    </Popover>
  )
}
