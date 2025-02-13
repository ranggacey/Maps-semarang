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

  // Inisialisasi peta dan simpan di state
  useEffect(() => {
    const newMap = L.map("map").setView([-6.9667, 110.4167], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(newMap);
    setMap(newMap);
    return () => {
      newMap.remove();
    };
  }, []);

  // Fungsi untuk memulai navigasi
  function startNavigation(destination) {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        // Hapus rute yang sudah ada jika ada
        if (routingControl) {
          map.removeControl(routingControl);
        }
        const newRoutingControl = L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(destination[0], destination[1]),
          ],
          routeWhileDragging: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: "red", weight: 6 }], // Rute berwarna merah
          },
        }).addTo(map);
        setRoutingControl(newRoutingControl);
      },
      (error) => {
        alert("Gagal mendapatkan lokasi pengguna: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  // Fungsi untuk membatalkan rute
  function cancelRoute() {
    if (routingControl && map) {
      map.removeControl(routingControl);
      setRoutingControl(null);
    }
  }

  // Tambahkan marker ke peta berdasarkan kategori dan searchTerm
  useEffect(() => {
    if (!map) return;
    const markers = [];
    places.forEach((place) => {
      if (
        (selectedCategory === "Semua" || place.category === selectedCategory) &&
        (searchTerm === "" || place.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
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

    // Tambahkan event listener untuk tombol "Go" saat popup terbuka
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

    return () => {
      markers.forEach((marker) => map.removeLayer(marker));
    };
  }, [map, selectedCategory, searchTerm]);

  // Auto-focus input saat search bar terbuka
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Tutup search bar jika klik di luar area search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center py-3 px-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold text-gray-800">Peta Wisata Semarang</h1>
        {/* Search Bar & Dropdown */}
        <div ref={searchContainerRef} className="relative flex items-center space-x-2">
          {!searchOpen ? (
            <Search className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => setSearchOpen(true)} />
          ) : (
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
          {/* Dropdown Filter */}
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
      {/* Cancel Route Button (ditampilkan jika ada rute aktif) */}
      {routingControl && (
        <button
          onClick={cancelRoute}
          className="mt-20 px-4 py-2 bg-red-500 text-white rounded shadow mb-4"
        >
          Cancel Route
        </button>
      )}
      {/* Peta */}
      <div id="map" className="w-full h-[80vh] rounded-lg shadow-lg mt-16 bg-blue-100/20" />
    </div>
  );
}
