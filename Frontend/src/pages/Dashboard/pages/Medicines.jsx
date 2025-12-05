import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Barcode from "react-barcode";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Printer,
  Search,
  Filter,
  X,
  Package,
  DollarSign,
  Calendar,
  Building,
  Tag,
  Layers,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
  const [activeSection, setActiveSection] = useState("list"); // list, add, search, stats
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });

  const barcodeRefs = useRef({});

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchTerm, medicines, showExpiringSoon]);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setMedicines(res.data);
      setFilteredMedicines(res.data);
      showAlert("success", "Medicines loaded successfully");
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to load medicines");
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

  const showAlert = (type, text) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage({ type: "", text: "" }), 3000);
  };

  const filterMedicines = () => {
    let filtered = medicines.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (med.Category?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (showExpiringSoon) {
        const expiryDate = new Date(med.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiryDate - today) / (1000 * 60 * 60 * 24)
        );
        return matchesSearch && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }

      return matchesSearch;
    });

    setFilteredMedicines(filtered);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sorted = [...filteredMedicines].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredMedicines(sorted);
    setSortConfig({ key, direction });
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
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to save medicine");
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
    setActiveSection("add");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        fetchMedicines();
        showAlert("success", "Medicine deleted successfully");
      } catch (err) {
        console.error(err);
        showAlert("error", "Failed to delete medicine");
      }
    }
  };

  const handlePrint = (id) => {
    const printContent = barcodeRefs.current[id];
    if (!printContent) return;

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            @media print {
              @page { size: auto; margin: 0; }
              body { margin: 0.5cm; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    setTimeout(() => {
      newWin.print();
      newWin.close();
    }, 250);
  };

  const calculateStats = () => {
    const totalMedicines = medicines.length;
    const totalValue = medicines.reduce(
      (sum, med) => sum + med.qty * med.cost_price,
      0
    );
    const totalProfit = medicines.reduce(
      (sum, med) => sum + med.qty * (med.sale_price - med.cost_price),
      0
    );
    const lowStock = medicines.filter((med) => med.qty < 10).length;
    const expiringSoon = medicines.filter((med) => {
      const expiryDate = new Date(med.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    return { totalMedicines, totalValue, totalProfit, lowStock, expiringSoon };
  };

  const stats = calculateStats();

  const renderForm = () => (
    <div className=" rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {editingId ? (
            <Edit2 className="w-5 h-5" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {editingId ? "Edit Medicine" : "Add New Medicine"}
        </h2>
        <button
          onClick={() => {
            setActiveSection("list");
            setEditingId(null);
            setFormData({
              name: "",
              company: "",
              category_id: "",
              qty: 0,
              cost_price: 0,
              sale_price: 0,
              expiry_date: "",
            });
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
            {editingId ? (
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
            onClick={() => {
              setFormData({
                name: "",
                company: "",
                category_id: "",
                qty: 0,
                cost_price: 0,
                sale_price: 0,
                expiry_date: "",
              });
              setEditingId(null);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white shadow-md border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Medicines</p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.totalMedicines}
            </p>
          </div>
          <Package className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Total Value</p>
            <p className="text-2xl font-bold text-green-700">
              ${stats.totalValue.toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">
              Potential Profit
            </p>
            <p className="text-2xl font-bold text-purple-700">
              ${stats.totalProfit.toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-purple-500" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-700">
              {stats.lowStock}
            </p>
          </div>
          <AlertCircle className="w-8 h-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-medium">Expiring Soon</p>
            <p className="text-2xl font-bold text-red-700">
              {stats.expiringSoon}
            </p>
          </div>
          <Calendar className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  p-4 md:p-6">
      {alertMessage.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white flex items-center gap-2`}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {alertMessage.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            Medicine Inventory
          </h1>
          <p className="text-gray-600">
            Manage your medicine stock, track inventory, and print barcodes
          </p>
        </div>

        {/* Stats Section */}
        {renderStats()}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveSection("list")}
              className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
                activeSection === "list"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              All Medicines ({medicines.length})
            </button>
            <button
              onClick={() => setActiveSection("add")}
              className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
                activeSection === "add"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Add New Medicine
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
                activeSection === "reports"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Search className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeSection === "add" && renderForm()}

          {activeSection === "list" && (
            <>
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search medicines by name, company, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowExpiringSoon(!showExpiringSoon)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        showExpiringSoon
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Expiring Soon
                    </button>
                    <button
                      onClick={() => setActiveSection("add")}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Medicine
                    </button>
                  </div>
                </div>
              </div>

              {/* Medicines Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "ID",
                        "Name",
                        "Company",
                        "Category",
                        "Qty",
                        "Cost",
                        "Sale",
                        "Expiry",
                        "Barcode",
                        "Actions",
                      ].map((header, idx) => (
                        <th
                          key={idx}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">
                            {header}
                            {[
                              "Name",
                              "Company",
                              "Qty",
                              "Cost",
                              "Sale",
                            ].includes(header) && (
                              <button
                                onClick={() =>
                                  handleSort(
                                    header.toLowerCase().replace(/\s+/g, "_")
                                  )
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ArrowUpDown className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMedicines.map((med) => (
                      <tr
                        key={med.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{med.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {med.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {med.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {med.Category?.name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              med.qty < 10
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {med.qty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${parseFloat(med.cost_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${parseFloat(med.sale_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {med.expiry_date ? (
                            new Date(med.expiry_date) < new Date() ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Expired
                              </span>
                            ) : (
                              <span className="text-gray-900">
                                {med.expiry_date.slice(0, 10)}
                              </span>
                            )
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div ref={(el) => (barcodeRefs.current[med.id] = el)}>
                            {med.barcode ? (
                              <div className="flex flex-col items-center">
                                <Barcode
                                  value={med.barcode}
                                  format="CODE128"
                                  height={40}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                  {med.barcode}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(med)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(med.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrint(med.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Print Barcode"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredMedicines.length === 0 && (
                      <tr>
                        <td colSpan="10" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Package className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-lg font-medium">
                              No medicines found
                            </p>
                            <p className="text-sm mt-1">
                              {searchTerm || showExpiringSoon
                                ? "Try changing your search or filter"
                                : "Add your first medicine to get started"}
                            </p>
                            {!searchTerm && !showExpiringSoon && (
                              <button
                                onClick={() => setActiveSection("add")}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Add Medicine
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredMedicines.length} of {medicines.length}{" "}
                medicines
                {showExpiringSoon && " (Expiring within 30 days)"}
              </div>
            </>
          )}

          {activeSection === "reports" && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Advanced Search
              </h3>
              <p className="text-gray-500">
                Advanced search features coming soon...
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Last updated: {new Date().toLocaleDateString()} • Total Value: $
            {stats.totalValue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
