// components/MedicineForm.jsx
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function MedicineForm({ onCreated }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    unitPrice: "",
    stock: "",
    expiryDate: "",
    type: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/medicines", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onCreated(res.data);
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      {/* بقیه فیلدها */}
      <button type="submit">Add Medicine</button>
    </form>
  );
}
