import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Barcode from "react-barcode";

const BASE_URL = "http://localhost:5000/api/medicines";
const CATEGORY_URL = "http://localhost:5000/api/categories";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    category_id: "",
    qty: 0,
    cost_price: 0,
    sale_price: 0,
    expiry_date: "",
  });
  const [editingId, setEditingId] = useState(null);

  const barcodeRefs = useRef({}); // 👈 store refs for each medicine

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(BASE_URL, formData);
      }
      setFormData({
        name: "",
        company: "",
        category_id: "",
        qty: 0,
        cost_price: 0,
        sale_price: 0,
        expiry_date: "",
      });
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (med) => {
    setFormData({
      name: med.name,
      company: med.company,
      category_id: med.category_id,
      qty: med.qty,
      cost_price: med.cost_price,
      sale_price: med.sale_price,
      expiry_date: med.expiry_date?.slice(0, 10) || "",
    });
    setEditingId(med.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        fetchMedicines();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 👉 Print barcode
  const handlePrint = (id) => {
    const printContent = barcodeRefs.current[id];
    if (!printContent) return;

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Medicines</h1>
      {/* Add/Edit Form */}
      {/* Add/Edit Form */}{" "}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {" "}
        <input
          type="text"
          name="name"
          placeholder="Medicine Name"
          value={formData.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />{" "}
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />{" "}
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        >
          {" "}
          <option value="">Select Category</option>{" "}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {" "}
              {cat.name}{" "}
            </option>
          ))}{" "}
        </select>{" "}
        <input
          type="number"
          name="qty"
          placeholder="Quantity"
          value={formData.qty}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />{" "}
        <input
          type="number"
          name="cost_price"
          placeholder="Cost Price"
          value={formData.cost_price}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />{" "}
        <input
          type="number"
          name="sale_price"
          placeholder="Sale Price"
          value={formData.sale_price}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />{" "}
        <input
          type="date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />{" "}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 col-span-1 md:col-span-3"
        >
          {" "}
          {editingId ? "Update Medicine" : "Add Medicine"}{" "}
        </button>{" "}
      </form>
      {/* Medicines Table */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Sale</th>
            <th className="border px-4 py-2">Expiry</th>
            <th className="border px-4 py-2">Barcode</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td className="border px-4 py-2">{med.id}</td>
              <td className="border px-4 py-2">{med.name}</td>
              <td className="border px-4 py-2">{med.company}</td>
              <td className="border px-4 py-2">{med.Category?.name || "-"}</td>
              <td className="border px-4 py-2">{med.qty}</td>
              <td className="border px-4 py-2">{med.cost_price}</td>
              <td className="border px-4 py-2">{med.sale_price}</td>
              <td className="border px-4 py-2">
                {med.expiry_date?.slice(0, 10) || "-"}
              </td>
              <td className="border px-4 py-2">
                <div ref={(el) => (barcodeRefs.current[med.id] = el)}>
                  {med.barcode ? (
                    <Barcode value={med.barcode} format="CODE128" height={50} />
                  ) : (
                    "-"
                  )}
                </div>
              </td>
              <td className="border px-4 py-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(med)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handlePrint(med.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Print Barcode
                </button>
              </td>
            </tr>
          ))}
          {medicines.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center py-4">
                No medicines found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Medicines;
