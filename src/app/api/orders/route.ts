import { NextResponse } from 'next/server'
import { mockOrders } from '@/features/orders/data/mock-data'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5Y2M5NTE3OS1kNzBhLTRlYmQtOTZmMy0yZDEzNzRmMGExZjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW5pc3RyYWRvciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU4iLCJleHAiOjE3NTM5OTg0MjIsImlzcyI6InRlY25vcGxhbnQifQ.WRa_jmhMEDyvek8fNWAJLds0-K8N_tM1kWapgjJU6mU'
const endpoint = 'https://d3e894781fe2.ngrok-free.app/api/orders'

export async function GET(_request: Request) {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  // adaptar la respuesta a la firma del front

  return NextResponse.json({ orders: data }, { status: 200 })
}

export function POST(_request: Request) {
  return NextResponse.json({ message: 'POST method called' }, { status: 200 })
}

export function PUT(_request: Request) {
  return NextResponse.json({ message: 'PUT method called' }, { status: 200 })
}

export function DELETE(_request: Request) {
  return NextResponse.json({ message: 'DELETE method called' }, { status: 200 })
}
