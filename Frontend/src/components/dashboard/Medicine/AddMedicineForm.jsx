import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Edit2,
  X,
  Tag,
  Building,
  Layers,
  Package,
  DollarSign,
  Calendar,
  CheckCircle,
} from "lucide-react";

const BASE_URL = "http://localhost:5000/api/medicines";

const AddMedicineForm = ({
  categories,
  fetchMedicines,
  setActiveSection,
  showAlert,
  editingMedicine,
  setEditingMedicine,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    category_id: "",
    qty: 0,
    cost_price: 0,
    sale_price: 0,
    expiry_date: "",
  });
  useEffect(() => {
    if (editingMedicine && editingMedicine.id) {
      setFormData({
        name: editingMedicine.name || "",
        company: editingMedicine.company || "",
        category_id: editingMedicine.category_id || "",
        qty: editingMedicine.qty || 0,
        cost_price: editingMedicine.cost_price || 0,
        sale_price: editingMedicine.sale_price || 0,
        expiry_date: editingMedicine.expiry_date || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        category_id: "",
        qty: 0,
        cost_price: 0,
        sale_price: 0,
        expiry_date: "",
      });
    }
  }, [editingMedicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine?.id) {
        await axios.put(`${BASE_URL}/${editingMedicine.id}`, formData);
        showAlert("success", "Medicine updated successfully");
      } else {
        await axios.post(BASE_URL, formData);
        showAlert("success", "Medicine added successfully");
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
      setActiveSection("list");
      if (setEditingMedicine) setEditingMedicine(null);
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to save medicine");
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      company: "",
      category_id: "",
      qty: 0,
      cost_price: 0,
      sale_price: 0,
      expiry_date: "",
    });
    if (setEditingMedicine) setEditingMedicine(null);
  };

  return (
    <div className="rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {editingMedicine?.id ? (
            <Edit2 className="w-5 h-5" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {editingMedicine?.id ? "Edit Medicine" : "Add New Medicine"}
        </h2>
        <button
          onClick={() => {
            setActiveSection("list");
            if (setEditingMedicine) setEditingMedicine(null);
            handleClear();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4" />
              Medicine Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter medicine name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building className="w-4 h-4" />
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Layers className="w-4 h-4" />
              Category
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4" />
              Quantity
            </label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              Cost Price
            </label>
            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              Sale Price
            </label>
            <input
              type="number"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {editingMedicine?.id ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Update Medicine
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Add Medicine
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicineForm;
