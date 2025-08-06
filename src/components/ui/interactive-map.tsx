"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface InteractiveMapProps {
  latitude: number
  longitude: number
  onLocationSelect?: (lat: number, lng: number) => void
  height?: string
  className?: string
}

// Componente interno para manejar el clic en el mapa
function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  const map = useMap()

  useEffect(() => {
    if (!onLocationSelect) return

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
    }

    map.on("click", handleClick)

    return () => {
      map.off("click", handleClick)
    }
  }, [map, onLocationSelect])

  return null
}

export function InteractiveMap({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  height = "400px",
  className = ""
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map>(null)

  // Centrar el mapa cuando cambien las coordenadas
  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.setView([latitude, longitude], 15)
    }
  }, [latitude, longitude])

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer
        center={[latitude || -34.6037, longitude || -58.3816]} // Buenos Aires por defecto
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador de la ubicación actual */}
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} />
        )}
        
        {/* Manejador de clics */}
        <MapClickHandler onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  )
} 