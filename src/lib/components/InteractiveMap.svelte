<script lang="ts">
  import { onMount, afterUpdate } from "svelte"
  import type { Map as LeafletMap } from "leaflet"

  // The URL for the custom map image, passed from the parent component.
  export let mapImageUrl: string | null | undefined

  let mapContainer: HTMLElement
  let map: LeafletMap

  onMount(async () => {
    // --- SSR FIX ---
    // We only run this code in the browser.
    if (typeof window !== "undefined") {
      // Dynamically import Leaflet and its CSS on the client-side.
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // --- ICON FIX (inside the browser check) ---
      // This known workaround fixes the 404 errors for marker icons.
      // @ts-expect-error We are intentionally modifying the prototype.
      delete L.Icon.Default.prototype._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/marker-icon-2x.png",
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
      })

      // --- THE CORE LOGIC ---

      // Scenario 1: A custom map image URL is provided.
      if (mapImageUrl) {
        // Initialize the map with a simple, non-geographic coordinate system.
        // DO NOT set the view here.
        map = L.map(mapContainer, {
          crs: L.CRS.Simple,
          minZoom: -5, // Allow zooming out far enough for large images
        })

        const img = new Image()
        img.src = mapImageUrl

        // Once the image is loaded, get its dimensions.
        img.onload = () => {
          // Define the image bounds based on its height and width.
          const bounds: [[number, number], [number, number]] = [
            [0, 0],
            [img.height, img.width],
          ]

          // Create an image overlay and add it to the map.
          L.imageOverlay(mapImageUrl, bounds).addTo(map)

          // *** THIS IS THE FIX ***
          // Fit the map view to the bounds of the image.
          // This sets the center AND zoom automatically.
          map.fitBounds(bounds)

          // Now that the view is set, it is SAFE to add a marker.
          L.marker(map.getCenter()).addTo(map).bindPopup("Map Center")
        }

        img.onerror = () => {
          console.error("Failed to load map image from URL:", mapImageUrl)
          // Optionally, you could fall back to the default map here.
        }
      } else {
        // Scenario 2: No custom map. Fall back to OpenStreetMap.
        // Here, we can set the view immediately.
        map = L.map(mapContainer).setView([51.505, -0.09], 13)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        // It's safe to add a marker here as well.
        L.marker(map.getCenter()).addTo(map).bindPopup("A sample pin.")
      }
    }
  })

  // Ensure the map resizes correctly if its container changes
  afterUpdate(() => {
    if (map) {
      map.invalidateSize()
    }
  })
</script>

<div
  bind:this={mapContainer}
  class="h-full w-full bg-gray-200"
  style="height: 600px"
></div>
