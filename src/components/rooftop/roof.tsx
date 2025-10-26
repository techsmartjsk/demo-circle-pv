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
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [manualPanelCount, setManualPanelCount] = useState<number | null>(null);
  const [rooftopRects, setRooftopRects] = useState<google.maps.Rectangle[]>([]);

  // If manual number is given, use that. Otherwise fallback to rows * columns.
  const panelCount =
    manualPanelCount !== null && manualPanelCount > 0
      ? manualPanelCount
      : rows * columns;

  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );
    if (existingScript) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBlH2pSG5K6Sqq8D1evknN6_Bf5TIOC57c&libraries=places,drawing,geometry`;
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
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
        console.warn("No nearby buildings found.");
        return;
      }

      const newRects: google.maps.Rectangle[] = [];

      results.forEach((place, index) => {
        if (place.geometry && place.geometry.location) {
          const pos = place.geometry.location;
          const offset = 0.00005; // ~5 meters

          const bounds = {
            north: pos.lat() + offset,
            south: pos.lat() - offset,
            east: pos.lng() + offset,
            west: pos.lng() - offset,
          };

          const rect = new window.google.maps.Rectangle({
            bounds,
            strokeColor: "#00FF00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#00FF00",
            fillOpacity: 0.3,
            map,
          });

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
          overlay.onAdd = function () {
            const panes = this.getPanes();
            panes?.overlayLayer.appendChild(labelDiv);
          };
          overlay.draw = function () {
            const projection = this.getProjection();
            const position = new window.google.maps.LatLng(pos.lat() + offset, pos.lng());
            const point = projection.fromLatLngToDivPixel(position);
            if (point && labelDiv.style) {
              labelDiv.style.left = point.x + "px";
              labelDiv.style.top = point.y + "px";
            }
          };
          overlay.onRemove = function () {
            labelDiv.parentNode?.removeChild(labelDiv);
          };
          overlay.setMap(map);

          rect.addListener("click", () => {
            setLat(pos.lat());
            setLng(pos.lng());
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
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(+latitude.toFixed(6));
        setLng(+longitude.toFixed(6));
        if (map) {
          map.setCenter({ lat: latitude, lng: longitude });
          clearRooftopRects();
          drawNearbyRooftops(map, latitude, longitude);
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
    alert(
      `Saved ${panelCount} panels (${rows} rows x ${columns} columns) at [${lat}, ${lng}]`
    );
  };

  return (
    <div className="min-h-screen p-6 font-sans py-20">
      <h1 className="text-2xl font-semibold mb-4 text-center font-roboto">Rooftop Solar Panel Detection</h1>

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
          className="px-3 py-2 bg-primary cursor-pointer text-white rounded mt-auto"
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Rows of panels:</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => {
                setRows(parseInt(e.target.value) || 0);
                setManualPanelCount(null);
              }}
              className="border p-2 rounded mt-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm">Columns of panels:</label>
            <input
              type="number"
              value={columns}
              onChange={(e) => {
                setColumns(parseInt(e.target.value) || 0);
                setManualPanelCount(null);
              }}
              className="border p-2 rounded mt-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm">Or enter total panels (uneven layout):</label>
            <input
              type="number"
              value={manualPanelCount ?? ""}
              onChange={(e) =>
                setManualPanelCount(
                  e.target.value ? parseInt(e.target.value) || 0 : null
                )
              }
              className="border p-2 rounded mt-1 w-full"
            />
          </div>

          <div className="col-span-3 text-sm text-gray-700 mt-2">
            Total Panels: <span className="font-semibold">{panelCount}</span>
          </div>

          <div className="col-span-3 flex justify-end mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
