import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PersonList = () => {
  const [people, setPeople] = useState([]);

  const fetchPeople = async () => {
    const res = await fetch("http://localhost:5000/api/person");
    const data = await res.json();
    setPeople(data);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Persons</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {people.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold">
              {p.name} {p.lastName}
            </h2>
            <p className="text-sm text-gray-600">{p.phone}</p>

            <img src={p.qrCode} alt="QR code" className="mt-3 w-32 h-32" />

            <Link to={`/person/${p.id}`} className="block text-blue-600 mt-2">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonList;
