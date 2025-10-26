"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function Rooftop() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [lat, setLat] = useState<number>(22.3379864);
  const [lng, setLng] = useState<number>(114.2632867);
  const [roofDetected, setRoofDetected] = useState<boolean>(false);

  const [rows, setRows] = useState<string>("");
  const [columns, setColumns] = useState<string>("");
  const [panelsPerRow, setPanelsPerRow] = useState<string>("");
  const [manualPanelCount, setManualPanelCount] = useState<string>("");

  const [rooftopRects, setRooftopRects] = useState<google.maps.Rectangle[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );
    if (existingScript) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    if (!window.google || !mapRef.current) return;

    const m = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 19,
      mapTypeId: "satellite",
    });

    setMap(m);
    drawNearbyRooftops(m, lat, lng);
  };

  const drawNearbyRooftops = (map: google.maps.Map, lat: number, lng: number) => {
    const service = new window.google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 10,
      type: "building",
    };

    service.nearbySearch(request, (results, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) return;

      const newRects: google.maps.Rectangle[] = [];

      results.forEach((place, index) => {
        if (place.geometry && place.geometry.location) { 
            const pos = place.geometry.location; const offset = 0.00005; // ~5 meters 
            const bounds = { north: pos.lat() + offset, south: pos.lat() - offset, east: pos.lng() + offset, west: pos.lng() - offset, }; 
            const rect = new window.google.maps.Rectangle({ bounds, strokeColor: "#00FF00", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#00FF00", fillOpacity: 0.3, map, }); 
            const labelDiv = document.createElement("div"); 
            labelDiv.textContent = `Roof ${index + 1}`; 
            labelDiv.style.position = "absolute"; 
            labelDiv.style.background = "rgba(0, 128, 0, 0.7)"; 
            labelDiv.style.color = "white"; 
            labelDiv.style.padding = "2px 6px"; 
            labelDiv.style.fontSize = "12px"; 
            labelDiv.style.fontWeight = "bold"; 
            labelDiv.style.borderRadius = "4px"; 
            labelDiv.style.transform = "translate(-50%, -100%)"; 
            labelDiv.style.whiteSpace = "nowrap"; 
            const overlay = new window.google.maps.OverlayView(); 
            overlay.onAdd = function () { const panes = this.getPanes(); 
            panes?.overlayLayer.appendChild(labelDiv); }; 
            overlay.draw = function () { const projection = this.getProjection(); 
                const position = new window.google.maps.LatLng(pos.lat() + offset, pos.lng()); 
                const point = projection.fromLatLngToDivPixel(position); 
                if (point && labelDiv.style) { labelDiv.style.left = point.x + "px"; 
                labelDiv.style.top = point.y + "px"; } }; 
                overlay.onRemove = function () { 
                    labelDiv.parentNode?.removeChild(labelDiv); }; 
                    overlay.setMap(map); 
                    rect.addListener("click", () => { 
                        setLat(pos.lat()); setLng(pos.lng()); 
                        map.panTo(pos); 
                    setRoofDetected(true); 
                });
          newRects.push(rect);
        }
      });

      setRooftopRects(newRects);
    });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(+pos.coords.latitude.toFixed(6));
        setLng(+pos.coords.longitude.toFixed(6));
        if (map) {
          map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          clearRooftopRects();
          drawNearbyRooftops(map, pos.coords.latitude, pos.coords.longitude);
        }
      },
      (err) => alert("Location error: " + err.message)
    );
  };

  const handleUpdateMap = () => {
    if (!map) return;
    map.setCenter({ lat, lng });
    clearRooftopRects();
    drawNearbyRooftops(map, lat, lng);
  };

  const clearRooftopRects = () => {
    rooftopRects.forEach((r) => r.setMap(null));
    setRooftopRects([]);
  };

  const handleSave = () => {
    if (!manualPanelCount) {
      alert("Please enter the total number of panels.");
      return;
    }

    alert(`
Saved rooftop config:
Rows: ${rows || "N/A"}
Panels per row: ${panelsPerRow || "N/A"}
Columns: ${columns || "N/A"}
Total Panels: ${manualPanelCount}
Location: (${lat}, ${lng})
    `);
  };

  return (
    <div className="min-h-screen p-6 font-sans py-20">
      <h1 className="text-2xl font-semibold mb-4 text-center font-roboto">
        Rooftop Solar Panel Detection
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-xs">Latitude</label>
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="text-xs">Longitude</label>
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleUpdateMap}
          className="px-3 py-2 bg-primary text-white rounded mt-auto"
        >
          Update Map
        </button>

        <button
          onClick={handleGeolocation}
          className="px-3 py-2 bg-gray-800 text-white rounded mt-auto"
        >
          Use My Location
        </button>
      </div>

      <div ref={mapRef} className="border rounded mb-4" style={{ height: "500px" }} />

      {roofDetected && (
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Enter Panel Layout (Manual Only)</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm">Rows</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="border p-2 rounded mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-sm">Panels per row</label>
              <input
                type="number"
                value={panelsPerRow}
                onChange={(e) => setPanelsPerRow(e.target.value)}
                className="border p-2 rounded mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-sm">Columns</label>
              <input
                type="number"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                className="border p-2 rounded mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-sm">Total Panels (Required)</label>
              <input
                type="number"
                value={manualPanelCount}
                onChange={(e) => setManualPanelCount(e.target.value)}
                className="border p-2 rounded mt-1 w-full"
              />
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
