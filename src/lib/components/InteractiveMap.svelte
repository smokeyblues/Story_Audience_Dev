<script lang="ts">
  import { onMount } from "svelte"
  import "leaflet/dist/leaflet.css"
  import L from "leaflet"

  let mapContainer: HTMLElement
  let map: L.Map

  onMount(async () => {
    // Dynamically import Leaflet only on the client-side
    const L = (await import("leaflet")).default

    // Prevents map from initializing more than once
    if (map) {
      return
    }

    map = L.map(mapContainer).setView([51.505, -0.09], 13) // Default view (London)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add a sample marker
    L.marker([51.505, -0.09])
      .addTo(map)
      .bindPopup("A sample pin.<br> This can be linked to an entity.")
      .openPopup()
  })
</script>

<div
  bind:this={mapContainer}
  style="height: 500px; width: 100%; border-radius: 0.5rem;"
></div>
