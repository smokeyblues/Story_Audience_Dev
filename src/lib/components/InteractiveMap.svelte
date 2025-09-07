<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import type { Map as LeafletMap, LayerGroup } from "leaflet"
  import type { Tables } from "../../DatabaseDefinitions"
  import { page } from "$app/stores"

  export let mapImageUrl: string | null | undefined
  export let elements: Tables<"elements">[] = []

  let mapContainer: HTMLElement
  let map: LeafletMap
  let elementMarkers: LayerGroup

  onMount(async () => {
    if (typeof window !== "undefined") {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // --- ICON FIX ---
      // @ts-expect-error We are intentionally modifying the prototype.
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/marker-icon-2x.png",
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
      })

      if (mapImageUrl) {
        map = L.map(mapContainer, {
          crs: L.CRS.Simple,
          zoomSnap: 0.1,
          maxBoundsViscosity: 1.0,
          attributionControl: false, // <-- REMOVES LEAFLET BRANDING
        })

        const img = new Image()
        img.src = mapImageUrl
        img.onload = () => {
          const bounds: [[number, number], [number, number]] = [
            [0, 0],
            [img.height, img.width],
          ]
          L.imageOverlay(mapImageUrl, bounds).addTo(map)

          const center = [img.height / 2, img.width / 2] as [number, number]

          // Calculate a zoom level that fits the whole map
          const fitZoom = map.getBoundsZoom(L.latLngBounds(bounds), true)

          map.setView(center, fitZoom)
          map.setMinZoom(fitZoom - 2) // <-- ALLOWS ZOOMING OUT
          map.setMaxZoom(fitZoom + 4) // <-- ALLOWS ZOOMING IN FURTHER
          map.setMaxBounds(bounds)

          // Add markers for elements
          elementMarkers = L.layerGroup().addTo(map)
          elements.forEach(addMarkerForElement)
        }
      } else {
        // Fallback to OpenStreetMap
        map = L.map(mapContainer, { attributionControl: false }).setView(
          [51.505, -0.09],
          13,
        )
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)
      }
    }
  })

  function addMarkerForElement(element: Tables<"elements">) {
    if (
      element.properties &&
      typeof element.properties === "object" &&
      "latitude" in element.properties &&
      "longitude" in element.properties
    ) {
      const L = window.L // Assuming Leaflet is loaded globally
      const { latitude, longitude } = element.properties as {
        latitude: number
        longitude: number
      }

      const { teamId, worldId } = $page.params

      // Create popup content with element name and a link to its page
      const popupContent = `
        <div style="font-family: sans-serif;">
          <b>${element.name}</b>
          <br>
          <a href="/account/teams/${teamId}/worlds/${worldId}/elements/${element.id}" title="View Details" style="text-decoration: none; font-size: 1.2em; color: #337ab7;">
            &#128279; </a>
        </div>
      `

      const marker = L.marker([latitude, longitude])
      marker.bindPopup(popupContent)

      if (elementMarkers) {
        marker.addTo(elementMarkers)
      }
    }
  }

  onDestroy(() => {
    if (map) {
      map.remove()
    }
  })
</script>

<div
  bind:this={mapContainer}
  class="h-full w-full bg-gray-200"
  style="height: 600px"
></div>
