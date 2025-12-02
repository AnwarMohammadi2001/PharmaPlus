import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ScanQR = () => {
  const [scannedData, setScannedData] = useState(null);
  const [person, setPerson] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (data) => {
    if (data) {
      setScannedData(data);

      try {
        // Extract ID from QR code URL
        const id = data.split("/").pop();

        const token = localStorage.getItem("token"); // if you need auth
        const res = await fetch(`${BASE_URL}/api/person/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch person info");
        const result = await res.json();
        setPerson(result);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Scan QR Code</h2>

      <QrReader
        onResult={(result, error) => {
          if (!!result) handleScan(result?.text);
          if (!!error) console.error(error);
        }}
        constraints={{ facingMode: "environment" }}
        className="w-full"
      />

      {person && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-bold mb-2">
            {person.name} {person.lastName}
          </h3>
          <p>Phone: {person.phone}</p>
          <p>Age: {person.age}</p>
          <p>Education: {person.education}</p>
          <p>Birth Date: {person.birthDate}</p>
          <p>Country: {person.country}</p>
          <p>Gender: {person.gender}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ScanQR;
