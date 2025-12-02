import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  const fetchPerson = async () => {
    const res = await fetch(`http://localhost:5000/api/person/${id}`);
    const data = await res.json();
    setPerson(data);
  };

  useEffect(() => {
    fetchPerson();
  }, [id]);

  if (!person) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-3">
        {person.name} {person.lastName}
      </h1>

      <p>
        <strong>Phone:</strong> {person.phone}
      </p>
      <p>
        <strong>Age:</strong> {person.age}
      </p>
      <p>
        <strong>Education:</strong> {person.education}
      </p>
      <p>
        <strong>Birth Date:</strong> {person.birthDate}
      </p>
      <p>
        <strong>Country:</strong> {person.country}
      </p>
      <p>
        <strong>Gender:</strong> {person.gender}
      </p>

      <img src={person.qrCode} className="mt-5 w-40" />
    </div>
  );
};

export default PersonDetails;
