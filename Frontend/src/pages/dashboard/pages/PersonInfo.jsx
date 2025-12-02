import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PersonInfo = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/person/${id}`)
      .then((res) => res.json())
      .then((data) => setPerson(data));
  }, [id]);

  if (!person) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Person Information</h1>

      {Object.entries(person).map(
        ([key, val]) =>
          key !== "qrCode" && (
            <p key={key} className="border-b py-2">
              <strong>{key}:</strong> {val}
            </p>
          )
      )}
    </div>
  );
};

export default PersonInfo;
