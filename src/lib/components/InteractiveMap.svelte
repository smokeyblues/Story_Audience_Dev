<script lang="ts">
  import { onMount } from "svelte"
  import "leaflet/dist/leaflet.css"
  // Import the full Leaflet library and the specific Map type
  import L, { type Map as LeafletMap } from "leaflet"

  let mapContainer: HTMLElement
  // Use the specific LeafletMap type instead of 'any'
  let map: LeafletMap

  onMount(async () => {
    // Manually set the paths for the default marker icons.
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "marker-icon-2x.png",
      iconUrl: "marker-icon.png",
      shadowUrl: "marker-shadow.png",
    })

    if (map) {
      return
    }

    map = L.map(mapContainer).setView([51.505, -0.09], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

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
