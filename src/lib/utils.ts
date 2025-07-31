import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha desde formato ISO a dd/MM/yyyy
 * @param dateString - Fecha en formato ISO o dd/MM/yyyy
 * @returns Fecha formateada como dd/MM/yyyy
 */
export function formatDate(dateString: string): string {
  // Si ya está en formato dd/MM/yyyy, retornarlo tal como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString
  }
  
  // Si está en formato ISO, convertirlo
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString // Si no se puede parsear, retornar el original
    }
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch {
    return dateString // Si hay error, retornar el original
  }
}

/**
 * Convierte una fecha desde cualquier formato a objeto Date para comparaciones
 * @param dateString - Fecha en formato ISO o dd/MM/yyyy
 * @returns Objeto Date
 */
export function parseDate(dateString: string): Date {
  // Si está en formato dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }
  
  // Si está en formato ISO
  return new Date(dateString)
}
