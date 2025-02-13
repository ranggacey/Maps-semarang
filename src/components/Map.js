"use client";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -6.966667, // Koordinat Semarang
  lng: 110.416664,
};

// Daftar lokasi wisata di Semarang
const wisataSemarang = [
  {
    id: 1,
    name: "Lawang Sewu",
    position: { lat: -6.9826, lng: 110.4091 },
    description: "Bangunan bersejarah dengan arsitektur megah dan cerita mistis.",
  },
  {
    id: 2,
    name: "Sam Poo Kong",
    position: { lat: -6.9785, lng: 110.3916 },
    description: "Kelenteng tertua di Semarang dengan sejarah Laksamana Cheng Ho.",
  },
  {
    id: 3,
    name: "Kota Lama Semarang",
    position: { lat: -6.9714, lng: 110.4288 },
    description: "Kawasan penuh bangunan kolonial dengan suasana khas Eropa.",
  },
  {
    id: 4,
    name: "Pantai Marina",
    position: { lat: -6.9483, lng: 110.3944 },
    description: "Pantai dengan pemandangan indah dan tempat rekreasi keluarga.",
  },
];

export default function Map() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {/* Tambahkan marker untuk setiap lokasi wisata */}
        {wisataSemarang.map((place) => (
          <Marker
            key={place.id}
            position={place.position}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* Tampilkan info window saat marker diklik */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h3>{selectedPlace.name}</h3>
              <p>{selectedPlace.description}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
