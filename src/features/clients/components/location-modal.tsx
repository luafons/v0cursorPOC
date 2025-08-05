"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Edit3, Search, CheckCircle, AlertCircle, Info } from "lucide-react"

interface LocationData {
  latitude: number
  longitude: number
  address?: string
  accuracy?: number
  timestamp: number
}

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationConfirm: (location: LocationData) => void
}

export function LocationModal({ isOpen, onClose, onLocationConfirm }: LocationModalProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [manualLat, setManualLat] = useState("")
  const [manualLng, setManualLng] = useState("")
  const [searchAddress, setSearchAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("La geolocalización no está soportada en este navegador")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }
        setCurrentLocation(location)
        setManualLat(location.latitude.toString())
        setManualLng(location.longitude.toString())
        getAddressFromCoords(location.latitude, location.longitude)
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = "Error al obtener la ubicación"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso denegado para acceder a la ubicación"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible"
            break
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado"
            break
        }
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  // Función para obtener dirección desde coordenadas (Nominatim - gratuito)
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      if (data.display_name) {
        setCurrentLocation(prev => prev ? {
          ...prev,
          address: data.display_name
        } : null)
      }
    } catch (error) {
      console.log("Error al obtener dirección:", error)
    }
  }

  // Función para buscar dirección y obtener coordenadas
  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
      )
      const data = await response.json()

      if (data.length > 0) {
        const result = data[0]
        const location: LocationData = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name,
          timestamp: Date.now(),
        }
        setCurrentLocation(location)
        setManualLat(location.latitude.toString())
        setManualLng(location.longitude.toString())
      } else {
        setError("No se encontró la dirección especificada")
      }
    } catch (error) {
      setError("Error al buscar la dirección")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para actualizar coordenadas manualmente
  const updateManualLocation = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) {
      setError("Coordenadas inválidas")
      return
    }

    if (lat < -90 || lat > 90) {
      setError("Latitud debe estar entre -90 y 90")
      return
    }

    if (lng < -180 || lng > 180) {
      setError("Longitud debe estar entre -180 y 180")
      return
    }

    setError(null)
    const location: LocationData = {
      latitude: lat,
      longitude: lng,
      timestamp: Date.now(),
    }
    setCurrentLocation(location)
    getAddressFromCoords(lat, lng)
  }

  // Función para confirmar ubicación
  const confirmLocation = () => {
    if (currentLocation) {
      onLocationConfirm(currentLocation)
      onClose()
    }
  }

  // Cargar ubicación al abrir el modal
  useEffect(() => {
    if (isOpen) {
      getCurrentLocation()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Registrar Ubicación de Visita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sección: Obtener ubicación actual */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary" />
              <Label className="font-medium">📍 Obtener Mi Ubicación Actual</Label>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                <strong>¿Qué hace?</strong> Usa el GPS de tu celular para obtener tu ubicación exacta. 
                Es la opción más precisa y rápida.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={getCurrentLocation} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Obteniendo ubicación..." : "🚀 Obtener Mi Ubicación"}
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
          </div>

          {/* Sección: Buscar dirección */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <Label className="font-medium">🔍 Buscar por Dirección</Label>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Info className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                <strong>¿Qué hace?</strong> Escribe una dirección y el sistema la convierte en coordenadas. 
                Útil si conoces la dirección pero no las coordenadas.
              </p>
            </div>
            
            <div className="flex gap-2">
                             <Input
                 placeholder="Ej: Av. Corrientes 123, Buenos Aires, Argentina"
                 value={searchAddress}
                 onChange={(e) => setSearchAddress(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSearchAddress()}
               />
               <Button onClick={handleSearchAddress} disabled={isLoading || !searchAddress.trim()}>
                 🔍 Buscar
               </Button>
            </div>
          </div>

          {/* Sección: Editar coordenadas manualmente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-primary" />
              <Label className="font-medium">✏️ Editar Coordenadas Manualmente</Label>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <Info className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-purple-800">
                <strong>¿Qué hace?</strong> Permite ingresar latitud y longitud exactas. 
                Ideal si tienes las coordenadas GPS o quieres ajustar la ubicación.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="-34.6037"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Rango: -90 a 90</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-58.3816"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Rango: -180 a 180</p>
              </div>
            </div>
            
            <Button onClick={updateManualLocation} variant="outline" className="w-full">
              ✏️ Actualizar Ubicación
            </Button>
          </div>

          {/* Sección: Mapa (simulado) */}
          <div className="space-y-3">
            <Label className="font-medium">🗺️ Vista del Mapa</Label>
            
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Info className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-800">
                <strong>¿Qué hace?</strong> Aquí se mostraría un mapa interactivo donde podrías hacer clic 
                para seleccionar la ubicación. (Próximamente con OpenStreetMap)
              </p>
            </div>
            
            <div className="h-64 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Mapa Interactivo</p>
                <p className="text-xs">(OpenStreetMap + Leaflet)</p>
                <p className="text-xs mt-1">Haz clic para seleccionar ubicación</p>
                <p className="text-xs text-blue-600 mt-2">🚧 En desarrollo</p>
              </div>
            </div>
          </div>

          {/* Sección: Información de ubicación */}
          {currentLocation && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <Label className="font-medium">✅ Ubicación Seleccionada</Label>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latitud:</span>
                  <Badge variant="secondary">{currentLocation.latitude.toFixed(6)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longitud:</span>
                  <Badge variant="secondary">{currentLocation.longitude.toFixed(6)}</Badge>
                </div>
                {currentLocation.accuracy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precisión GPS:</span>
                    <Badge variant="secondary">±{Math.round(currentLocation.accuracy)}m</Badge>
                  </div>
                )}
                {currentLocation.address && (
                  <div className="mt-3 p-2 bg-background rounded border">
                    <span className="text-muted-foreground text-xs">📍 Dirección:</span>
                    <p className="text-sm mt-1">{currentLocation.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              ❌ Cancelar
            </Button>
            <Button 
              onClick={confirmLocation} 
              disabled={!currentLocation}
              className="flex-1"
            >
              ✅ Confirmar Ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 