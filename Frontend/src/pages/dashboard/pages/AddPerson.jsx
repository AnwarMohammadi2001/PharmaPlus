import React, { useState } from "react";

const AddPerson = () => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    age: "",
    education: "",
    birthDate: "",
    country: "",
    gender: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/person", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Person added successfully!");
      setForm({
        name: "",
        lastName: "",
        phone: "",
        age: "",
        education: "",
        birthDate: "",
        country: "",
        gender: "",
      });
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Add New Person</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(form).map((field) => (
          <div key={field}>
            <label className="block capitalize font-semibold mb-1">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Person
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
