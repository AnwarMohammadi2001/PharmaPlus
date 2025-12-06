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

// const BASE_URL = import.meta.env.VITE_BASE_URL;
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
      setActiveSection("add");
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
  // inside AddMedicineForm component
  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  return (
    <div className="rounded-md bg-gray-50 shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
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
          <X className="w-5 h-5 text-red-500" />
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
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
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
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Layers className="w-4 h-4" />
              Category
            </label>

            <div
              onClick={() => setCatOpen(!catOpen)}
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
            >
              <span>
                {formData.category_id
                  ? categories.find((c) => c.id == formData.category_id)?.name
                  : "Select Category"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  catOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {catOpen && (
              <div className="absolute top-full left-0  z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
                {/* Search input */}
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-gray-200 rounded-md mb-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search category..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                />

                {/* List */}
                <div className="max-h-56 overflow-y-auto">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            category_id: cat.id,
                          }));
                          setCatOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                      >
                        {cat.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm px-3 py-2">
                      No category found
                    </div>
                  )}
                </div>
              </div>
            )}
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
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
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
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
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
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
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
              className="w-full px-4 py-2 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r cursor-pointer bg-primary text-white font-medium rounded-md hover:bg-primary/80 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
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
            className="px-6 py-3 bg-gray-200 cursor-pointer text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicineForm;
