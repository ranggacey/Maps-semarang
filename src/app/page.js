"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import places from "@/data/places";
import { Search, X } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const newMap = L.map("map").setView([-6.9667, 110.4167], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(newMap);
    setMap(newMap);
    return () => newMap.remove();
  }, []);

  function startNavigation(destination) {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        if (routingControl) {
          map.removeControl(routingControl);
        }
        const newRoutingControl = L.Routing.control({
          waypoints: [L.latLng(...userLocation), L.latLng(...destination)],
          routeWhileDragging: false,
          createMarker: () => null,
          lineOptions: { styles: [{ color: "red", weight: 6 }] },
        }).addTo(map);
        setRoutingControl(newRoutingControl);
      },
      (error) => alert("Gagal mendapatkan lokasi: " + error.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function cancelRoute() {
    if (routingControl && map) {
      map.removeControl(routingControl);
      setRoutingControl(null);
    }
  }

  useEffect(() => {
    if (!map) return;
    const markers = [];
    places.forEach((place) => {
      if (
        (selectedCategory === "Semua" || place.category === selectedCategory) &&
        (searchTerm === "" || place.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        const icon = L.icon({
          iconUrl: place.img,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });
        const popupContent = `
          <div class="text-center">
            <h2 class="text-lg font-bold">${place.name}</h2>
            <span class="text-sm text-gray-500">${place.category}</span>
            <img src="${place.img}" alt="${place.name}" class="rounded-lg mt-2 w-36 h-24 object-cover">
            <button class="go-btn mt-2 px-3 py-1 border rounded-md bg-blue-500 text-white" data-lat="${place.lat}" data-lng="${place.lng}">Go</button>
          </div>
        `;
        const marker = L.marker([place.lat, place.lng], { icon })
          .addTo(map)
          .bindPopup(popupContent);
        markers.push(marker);
      }
    });

    map.on("popupopen", (e) => {
      const btn = e.popup._contentNode.querySelector(".go-btn");
      if (btn) {
        btn.addEventListener("click", () => {
          const destLat = btn.getAttribute("data-lat");
          const destLng = btn.getAttribute("data-lng");
          startNavigation([parseFloat(destLat), parseFloat(destLng)]);
        });
      }
    });

    return () => markers.forEach((marker) => map.removeLayer(marker));
  }, [map, selectedCategory, searchTerm]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center py-3 px-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold text-gray-800">Peta Wisata Semarang</h1>
        <div ref={searchContainerRef} className="relative flex items-center space-x-2">
          <Search className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => setSearchOpen(true)} />
          {searchOpen && (
            <div className="absolute top-0 right-0 bg-white shadow-lg rounded-lg p-2 flex items-center w-64">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari tempat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md text-black outline-none"
              />
              <X className="w-6 h-6 text-gray-600 cursor-pointer ml-2" onClick={() => setSearchOpen(false)} />
            </div>
          )}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md shadow-md text-lg bg-blue-200 text-black hover:bg-blue-300 transition"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Wisata Alam">Wisata Alam</option>
            <option value="Wisata">Wisata</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Sejarah">Sejarah</option>
          </select>
        </div>
      </div>
      {routingControl && (
        <button onClick={cancelRoute} className="mt-20 px-4 py-2 bg-red-500 text-white rounded shadow mb-4">
          Cancel Route
        </button>
      )}
      <div id="map" className="w-full h-[80vh] rounded-lg shadow-lg mt-16 bg-blue-100/20" />
    </div>
  );
}
