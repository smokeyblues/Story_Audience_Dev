<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte"
  import type { Map as LeafletMap, LayerGroup, DivIcon } from "leaflet"
  import type * as Leaflet from "leaflet"
  import type { Tables } from "../../DatabaseDefinitions"
  import { page } from "$app/stores"

  // --- PROPS ---
  export let mapImageUrl: string | null | undefined
  export let mapType: "openstreetmap" | "custom_image" = "custom_image"
  export let elements: Tables<"elements">[] = []
  export let editable = false // Is the map in an editable state?
  export let singleMarkerLocation: { lat: number; lng: number } | null = null
  export let singleMarkerElementName: string | null = null
  export let initialCenter: { lat: number; lng: number } | null = null

  let mapContainer: HTMLElement
  let map: LeafletMap
  let markersLayer: LayerGroup

  const dispatch = createEventDispatcher()

  // --- NEW: Filter elements based on map type ---
  $: filteredElements = elements.filter((element) => {
    if (
      !element.properties ||
      typeof element.properties !== "object" ||
      !("latitude" in element.properties) ||
      !("longitude" in element.properties)
    ) {
      return false // Don't show elements without coordinates
    }

    const props = element.properties as { coordinate_system?: string }
    const coordinateSystem = props.coordinate_system

    if (mapType === "custom_image") {
      return coordinateSystem === "pixel"
    }
    if (mapType === "openstreetmap") {
      return coordinateSystem === "geographic"
    }
    return false
  })

  // --- ICON DEFINITIONS ---
  const iconDefs = {
    Character: {
      svg: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
      color: "#4285F4",
    }, // Blue
    Location: {
      svg: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
      color: "#DB4437",
    }, // Red
    Item: {
      svg: '<path d="M20 4h-4l-4-4-4 4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H4V6h4.52l4-4 4 4H20v14zM12 8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>',
      color: "#F4B400",
    }, // Yellow
    Default: {
      svg: '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>',
      color: "#9E9E9E",
    }, // Grey
  }

  function getIconForElement(elementType: string | null): DivIcon {
    const L = window.L
    const definition =
      iconDefs[elementType as keyof typeof iconDefs] || iconDefs.Default

    const iconHtml = `
			<svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${definition.color}" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.5));">
				${definition.svg}
			</svg>`

    return L.divIcon({
      html: iconHtml,
      className: "", // important to override default leaflet styles
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

  function initializeOpenStreetMap(L: typeof Leaflet) {
    map = L.map(mapContainer, {
      zoomSnap: 0.1,
      attributionControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const defaultCenter: [number, number] = [51.505, -0.09] // Default to London
    const defaultZoom = initialCenter ? 13 : 3

    if (initialCenter) {
      map.setView([initialCenter.lat, initialCenter.lng], defaultZoom)
    } else {
      map.setView(defaultCenter, defaultZoom)
    }

    markersLayer = L.layerGroup().addTo(map)
    filteredElements.forEach(addMarkerForElement)

    if (editable) {
      setupEditableMode()
    } else {
      // Handle single marker for non-editable OSM map
      if (
        singleMarkerLocation &&
        singleMarkerLocation.lat &&
        singleMarkerLocation.lng
      ) {
        const marker = L.marker(
          [singleMarkerLocation.lat, singleMarkerLocation.lng],
          {
            icon: getIconForElement("Location"),
          },
        ).addTo(markersLayer)

        if (singleMarkerElementName) {
          const popupContent = `
						<div style="font-family: sans-serif; text-align: center;">
							<b style="font-size: 1.1em;">${singleMarkerElementName}</b>
						</div>
					`
          marker.bindPopup(popupContent).openPopup()
        }
      }
    }
  }

  function initializeCustomMap(L: typeof Leaflet) {
    if (!mapImageUrl) return // Type guard

    map = L.map(mapContainer, {
      crs: L.CRS.Simple,
      zoomSnap: 0.1,
      maxBoundsViscosity: 1.0,
      attributionControl: false,
    })

    const img = new Image()
    img.src = mapImageUrl!
    img.onload = () => {
      const bounds: [[number, number], [number, number]] = [
        [0, 0],
        [img.height, img.width],
      ]
      L.imageOverlay(mapImageUrl, bounds).addTo(map)

      const defaultCenter = [img.height / 2, img.width / 2] as [number, number]
      const fitZoom = map.getBoundsZoom(L.latLngBounds(bounds), true)

      // --- MODIFIED: Use initialCenter if provided ---
      if (initialCenter) {
        map.setView([initialCenter.lat, initialCenter.lng], fitZoom + 2) // Zoom in a bit more
      } else {
        map.setView(defaultCenter, fitZoom)
      }

      map.setMinZoom(fitZoom - 2.5)
      map.setMaxZoom(fitZoom + 4)
      map.setMaxBounds(bounds)

      markersLayer = L.layerGroup().addTo(map)
      filteredElements.forEach(addMarkerForElement)

      if (editable) {
        setupEditableMode()
      } else {
        // If a single location is provided in non-editable mode, show it as a static marker
        if (
          singleMarkerLocation &&
          singleMarkerLocation.lat &&
          singleMarkerLocation.lng
        ) {
          const L = window.L
          const marker = L.marker(
            [singleMarkerLocation.lat, singleMarkerLocation.lng],
            {
              icon: getIconForElement("Location"),
            },
          ).addTo(markersLayer)

          // --- NEW: Add popup for the single marker ---
          if (singleMarkerElementName) {
            const popupContent = `
								<div style="font-family: sans-serif; text-align: center;">
									<b style="font-size: 1.1em;">${singleMarkerElementName}</b>
								</div>
							`
            marker.bindPopup(popupContent).openPopup()
          }
        }
      }
    }
  }

  onMount(async () => {
    if (typeof window !== "undefined") {
      const L = (await import("leaflet")).default
      window.L = L // Make it globally available for icon function
      await import("leaflet/dist/leaflet.css")

      if (mapType === "custom_image" && mapImageUrl) {
        initializeCustomMap(L)
      } else {
        // Default to OpenStreetMap if no custom map is provided or type is explicitly set
        initializeOpenStreetMap(L)
      }
    }
  })

  function setupEditableMode() {
    if (
      singleMarkerLocation &&
      singleMarkerLocation.lat &&
      singleMarkerLocation.lng
    ) {
      const L = window.L
      const marker = L.marker(
        [singleMarkerLocation.lat, singleMarkerLocation.lng],
        {
          draggable: true,
          icon: getIconForElement("Location"),
        },
      ).addTo(markersLayer)

      marker.on("dragend", (e) => {
        dispatch("locationchange", e.target.getLatLng())
      })
    }

    map.on("click", (e) => {
      markersLayer.clearLayers()
      const L = window.L
      const { teamId, worldId } = $page.params
      const latlng = e.latlng

      const popupContent = `
				<div style="font-family: sans-serif; text-align: center; min-width: 220px;">
					<b style="font-size: 1.05em;">Add a new element here?</b>
					<p style="margin: 8px 0 12px;">Choose what to create:</p>
					<div style="display: flex; flex-direction: column; gap: 8px; align-items: stretch;">
						<a href="/account/teams/${teamId}/worlds/${worldId}/elements/Character/create?lat=${latlng.lat}&lng=${latlng.lng}" style="text-decoration: none; background-color: #4285F4; color: white; padding: 8px 12px; border-radius: 4px; display: block;">Character</a>
						<a href="/account/teams/${teamId}/worlds/${worldId}/elements/Location/create?lat=${latlng.lat}&lng=${latlng.lng}" style="text-decoration: none; background-color: #DB4437; color: white; padding: 8px 12px; border-radius: 4px; display: block;">Location</a>
						<a href="/account/teams/${teamId}/worlds/${worldId}/elements/Item/create?lat=${latlng.lat}&lng=${latlng.lng}" style="text-decoration: none; background-color: #F4B400; color: white; padding: 8px 12px; border-radius: 4px; display: block;">Item</a>
					</div>
				</div>
			`

      const newMarker = L.marker(e.latlng, {
        draggable: true,
        icon: getIconForElement("Location"),
      }).addTo(markersLayer)

      newMarker.bindPopup(popupContent).openPopup()

      newMarker.on("dragend", (event) => {
        dispatch("locationchange", event.target.getLatLng())
      })

      dispatch("locationchange", e.latlng)
    })
  }

  function addMarkerForElement(element: Tables<"elements">) {
    if (
      element.properties &&
      typeof element.properties === "object" &&
      "latitude" in element.properties &&
      "longitude" in element.properties
    ) {
      const L = window.L
      const { latitude, longitude } = element.properties as {
        latitude: number
        longitude: number
      }
      const { teamId, worldId } = $page.params

      const popupContent = `
				<div style="font-family: sans-serif; text-align: center;">
					<b style="font-size: 1.1em;">${element.name}</b>
					<br>
					<a href="/account/teams/${teamId}/worlds/${worldId}/elements/${element.id}" title="View Details" style="text-decoration: none; font-size: 1.5em; color: #337ab7;">
						&#128279;
					</a>
				</div>
			`

      const icon = getIconForElement(element.type)
      const marker = L.marker([latitude, longitude], { icon })
      marker.bindPopup(popupContent)
      marker.addTo(markersLayer)
    }
  }

  onDestroy(() => {
    if (map) {
      map.remove()
    }
  })
</script>

<div class="relative">
  <div
    bind:this={mapContainer}
    class="h-full w-full bg-gray-200"
    style="height: 600px;"
  ></div>

  {#if !editable && elements.length > 0}
    <div
      class="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded shadow-lg z-[1000]"
    >
      <h4 class="font-bold text-sm mb-1">Legend</h4>
      <ul class="text-xs">
        {#each Object.entries(iconDefs) as [key, { color }]}
          {#if key !== "Default"}
            <li class="flex items-center">
              <span
                class="inline-block w-3 h-3 rounded-full mr-2"
                style="background-color: {color};"
              ></span>
              {key}
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>
