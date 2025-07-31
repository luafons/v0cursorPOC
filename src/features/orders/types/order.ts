export type OrderStatus =
  | 'Pendiente'
  | 'En revisión'
  | 'Procesado'
  | 'Preparado'
  | 'Despachado'
  | 'Rechazado'
  | 'Anulado'

export interface Order {
  amount: number
  businessName: string
  clientType: string
  comments: string | null
  creationDate: string // dd/mm/aaaa
  id: string
  orderNumber: string
  seller: string
  status: OrderStatus
  tangoNumber: string | null
  termDays: number
}

export interface Client {
  id: string
  name: string
}

export interface Seller {
  id: string
  name: string
}
