"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LocationModal } from "./location-modal"


// Definición de tipos para los datos del cliente
type ClientStatus = "Activo" | "Inactivo" | "Pendiente"

interface Client {
  cuit: string
  estado: ClientStatus
  id: string
  razonSocial: string
  vendedor: string
  visitaRegistrada: boolean
}

// Datos de ejemplo para la tabla
const clients: Client[] = [
  {
    cuit: "30-12345678-5",
    estado: "Activo",
    id: "1",
    razonSocial: "Agro S.A.",
    vendedor: "Juan Vendedor",
    visitaRegistrada: true,
  },
  {
    cuit: "30-87654321-3",
    estado: "Activo",
    id: "2",
    razonSocial: "El Campo SRL",
    vendedor: "Maria Vendedora",
    visitaRegistrada: true,
  },
  {
    cuit: "33-55555555-5",
    estado: "Inactivo",
    id: "3",
    razonSocial: "Futuro Rural",
    vendedor: "Juan Vendedor",
    visitaRegistrada: false,
  },
  {
    cuit: "30-11223344-8",
    estado: "Pendiente",
    id: "4",
    razonSocial: "La Cosecha Feliz",
    vendedor: "Juan Vendedor",
    visitaRegistrada: false,
  },
]

export function ClientsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeller, setSelectedSeller] = useState("all")
  const [clientData, setClientData] = useState(clients)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  // Función para manejar el cambio del interruptor de visita
  const handleToggleChange = (clientId: string, checked: boolean) => {
    setClientData((prevData) =>
      prevData.map((client) => (client.id === clientId ? { ...client, visitaRegistrada: checked } : client)),
    )
  }

  // Función para abrir el modal de ubicación
  const handleOpenLocationModal = (clientId: string) => {
    setSelectedClientId(clientId)
    setIsLocationModalOpen(true)
  }

  // Función para cerrar el modal de ubicación
  const handleCloseLocationModal = () => {
    setIsLocationModalOpen(false)
    setSelectedClientId(null)
  }

  // Función para confirmar la ubicación
  const handleLocationConfirm = (_location: { latitude: number; longitude: number; address?: string; accuracy?: number; timestamp: number }) => {
    // Aquí puedes guardar la ubicación en tu base de datos
    // Por ahora solo actualizamos el estado de visita
    if (selectedClientId) {
      setClientData((prevData) =>
        prevData.map((client) => 
          client.id === selectedClientId 
            ? { ...client, visitaRegistrada: true } 
            : client
        )
      )
    }
    handleCloseLocationModal()
  }

  // Filtrar clientes según el término de búsqueda y el vendedor seleccionado
  const filteredClients = clientData.filter((client) => {
    const matchesSearch =
      client.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cuit.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeller = selectedSeller === "all" || client.vendedor === selectedSeller

    return matchesSearch && matchesSeller
  })

  // Obtener una lista única de vendedores para el selector
  const uniqueSellers = Array.from(new Set(clients.map((client) => client.vendedor)))

  return (
    <div className="space-y-6">
      {/* Sección de filtros */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          className="max-w-sm w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por Razón Social o CUIT/DNI..."
          value={searchTerm}
        />
        <Select onValueChange={setSelectedSeller} value={selectedSeller}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Todos los Vendedores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Vendedores</SelectItem>
            {uniqueSellers.map((seller) => (
              <SelectItem key={seller} value={seller}>
                {seller}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sección de la tabla */}
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-bold text-foreground">Razón Social / Doc.</TableHead>
              <TableHead className="font-bold text-foreground">Vendedor</TableHead>
              <TableHead className="font-bold text-foreground">Estado</TableHead>
              <TableHead className="font-bold text-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow className="hover:bg-accent" key={client.id}>
                <TableCell>
                  <div className="font-medium">{client.razonSocial}</div>
                  <div className="text-sm text-muted-foreground">{`CUIT: ${client.cuit}`}</div>
                </TableCell>
                <TableCell>{client.vendedor}</TableCell>
                <TableCell>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.estado === 'Activo' ? 'bg-success text-success-foreground' :
                    client.estado === 'Inactivo' ? 'bg-destructive text-destructive-foreground' :
                    'bg-warning text-warning-foreground'
                  }`}>
                    {client.estado}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Button 
                      variant="link" 
                      className="text-primary hover:text-primary/80 p-0 h-auto"
                      onClick={() => handleOpenLocationModal(client.id)}
                    >
                      📍 Registrar Visita
                    </Button>
                    <Switch
                      checked={client.visitaRegistrada}
                      onCheckedChange={(checked: boolean) => handleToggleChange(client.id, checked)}
                      // Estilos personalizados para el interruptor usando colores del tema
                      className="data-[state=checked]:bg-success data-[state=unchecked]:bg-muted"
                    />
                    <Button className="text-primary hover:text-primary/80 p-0 h-auto" variant="link">
                      Ver/Editar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de ubicación */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={handleCloseLocationModal}
        onLocationConfirm={handleLocationConfirm}
      />
    </div>
  )
}