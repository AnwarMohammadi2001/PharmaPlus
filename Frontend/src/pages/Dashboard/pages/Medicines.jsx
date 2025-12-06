import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Search,
  PlusCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import MedicineList from "../../../components/dashboard/Medicine/MedicineList";
import AddMedicineForm from "../../../components/dashboard/Medicine/AddMedicineForm";
import Reports from "../../../components/dashboard/Medicine/Reports";
import Stats from "../../../components/dashboard/Medicine/Stats";

const BASE_URL = "http://localhost:5000/api/medicines";
const CATEGORY_URL = "http://localhost:5000/api/categories";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeSection, setActiveSection] = useState("list");
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });
  const [editingMedicine, setEditingMedicine] = useState(null);


  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setMedicines(res.data);
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

  return (
    <div className="min-h-screen p-4 md:p-6">
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            Medicine Inventory
          </h1>
          <p className="text-gray-600">
            Manage your medicine stock, track inventory, and print barcodes
          </p>
        </div>

        {/* Stats Section */}
        {/* <Stats stats={stats} /> */}

        {/* Navigation Tabs */}
        <div className="mb-6 overflow-hidden">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveSection("list")}
              className={`px-4 py-3  transition-all font-semibold flex cursor-pointer items-center gap-2 ${
                activeSection === "list"
                  ? " text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              All Medicines
            </button>
            <button
              onClick={() => setActiveSection("add")}
              className={`px-4 py-3 font-semibold transition-all flex  cursor-pointer items-center gap-2 ${
                activeSection === "add"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Add New Medicine
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className={`px-4 py-3 font-semibold transition-all flex cursor-pointer  items-center gap-2 ${
                activeSection === "reports"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Search className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="">
          {activeSection === "add" && (
            <AddMedicineForm
              categories={categories}
              fetchMedicines={fetchMedicines}
              setActiveSection={setActiveSection}
              showAlert={showAlert}
              editingMedicine={editingMedicine}
              setEditingMedicine={setEditingMedicine}
            />
          )}

          {activeSection === "list" && (
            <MedicineList
              medicines={medicines}
              categories={categories}
              onEdit={(med) => {
                setEditingMedicine(med); // set medicine to edit
                setActiveSection("add"); // open form
              }}
              onDelete={handleDelete}
              showAlert={showAlert}
            />
          )}

          {activeSection === "reports" && <Reports />}
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
