"use client";
import { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -6.966667,
  lng: 110.416664,
};

const wisataSemarang = [
  { id: 1, name: "Lawang Sewu", position: { lat: -6.9826, lng: 110.4091 }, description: "Bangunan bersejarah." },
  { id: 2, name: "Sam Poo Kong", position: { lat: -6.9785, lng: 110.3916 }, description: "Kelenteng tertua." },
  { id: 3, name: "Kota Lama", position: { lat: -6.9714, lng: 110.4288 }, description: "Kawasan kolonial." },
  { id: 4, name: "Pantai Marina", position: { lat: -6.9483, lng: 110.3944 }, description: "Pantai rekreasi." },
];

export default function Map() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {wisataSemarang.map((place) => (
        <Marker key={place.id} position={place.position} onClick={() => setSelectedPlace(place)} />
      ))}
      {selectedPlace && (
        <InfoWindow position={selectedPlace.position} onCloseClick={() => setSelectedPlace(null)}>
          <div>
            <h3>{selectedPlace.name}</h3>
            <p>{selectedPlace.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
