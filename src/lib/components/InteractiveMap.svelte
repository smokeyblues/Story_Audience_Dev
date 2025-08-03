<script lang="ts">
  import { onMount } from "svelte"
  import "leaflet/dist/leaflet.css"
  import L, { type Map as LeafletMap } from "leaflet"

  let mapContainer: HTMLElement
  let map: LeafletMap

  onMount(() => {
    // --- The Fix for the TypeScript Error ---
    // We are intentionally ignoring this line for TypeScript.
    // This is a known workaround for a Leaflet issue in bundler environments.
    // @ts-expect-error - This is a known workaround for a Leaflet issue in bundler environments.
    delete L.Icon.Default.prototype._getIconUrl
    // --- End of Fix ---

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
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
