export type OrderStatus = string

export interface Order {
  totalAmount: number
  customerName: string
  customerType: string
  comments: string | null
  date: string // dd/mm/aaaa
  id: string
  orderNumber: string
  sellerName: string
  status: OrderStatus
  tangoOrderNumber: string | null
  paymentTerm: number
}

export interface Client {
  id: string
  name: string
}

export interface Seller {
  id: string
  name: string
}
