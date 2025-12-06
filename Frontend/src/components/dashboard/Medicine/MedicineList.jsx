import React, { useState, useRef, useEffect } from "react";
import Barcode from "react-barcode";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Printer,
  Search,
  Calendar,
  ArrowUpDown,
  Package,
} from "lucide-react";
import { TbDotsVertical } from "react-icons/tb";

const MedicineList = ({ medicines, onEdit, onDelete, showAlert }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const barcodeRefs = useRef({});

useEffect(() => {
  filterMedicines();
}, [
  searchTerm,
  medicines,
  showExpiringSoon,
  selectedCategory,
  selectedCompany,
]);


  const filterMedicines = () => {
    let filtered = medicines.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (med.Category?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || med.Category?.name === selectedCategory;

      const matchesCompany =
        selectedCompany === "" || med.company === selectedCompany;

      let matchesExpiry = true;
      if (showExpiringSoon) {
        const expiryDate = new Date(med.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiryDate - today) / (1000 * 60 * 60 * 24)
        );
        matchesExpiry = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }

      return (
        matchesSearch && matchesCategory && matchesCompany && matchesExpiry
      );
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

  const handleEdit = (med) => {
    setEditingMedicine(med);
    onEdit(med);
  };
  const [openOptions, setOpenOptions] = useState(null);
  const handleOpenOptions = (id) => {
    setOpenOptions(openOptions === id ? null : id);
  };

  return (
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
          <div className="flex flex-wrap gap-2">
            {/* Expiring Soon */}
            <button
              onClick={() => setShowExpiringSoon(!showExpiringSoon)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                showExpiringSoon
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Expiring Soon (30 days)
            </button>

            {/* Filter by Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            >
              <option value="">All Categories</option>
              {[...new Set(medicines.map((m) => m.Category?.name))].map(
                (cat, idx) =>
                  cat && (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  )
              )}
            </select>

            {/* Filter by Company */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            >
              <option value="">All Companies</option>
              {[...new Set(medicines.map((m) => m.company))].map(
                (company, idx) => (
                  <option key={idx} value={company}>
                    {company}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="overflow-x-auto h-auto ">
        <table className="min-w-full ">
          <thead className="">
            <tr>
              {[
                "Item",
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
                  className={`px-4 py-3    text-xs font-semibold text-gray-900 uppercase tracking-wider ${
                    header === "Actions" ? "text-right" : "text-left"
                  } `}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      header === "Actions" ? "ml-auto justify-end" : ""
                    }`}
                  >
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200 rounded-md ">
            {filteredMedicines.map((med) => (
              <tr key={med.id} className="hover:bg-gray-100  transition-colors">
                <td className="px-4 py-2  whitespace-nowrap text-sm font-medium text-gray-700">
                  {med.id}
                </td>
                <td className="px-4 py-2  whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-700">
                    {med.name}
                  </div>
                </td>
                <td className="px-4 py-2  whitespace-nowrap font-medium text-sm text-gray-700">
                  {med.company}
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  <span className="inline-flex items-center text-sm font-medium  text-gray-700">
                    {med.Category?.name || "-"}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
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
                <td className="px-4 py-2  whitespace-nowrap text-sm text-gray-700">
                  AF {parseFloat(med.cost_price).toFixed(2)}
                </td>
                <td className="px-4 py-2  whitespace-nowrap text-sm text-gray-700">
                  AF {parseFloat(med.sale_price).toFixed(2)}
                </td>
                <td className="px-4 py-2  whitespace-nowrap text-sm">
                  {med.expiry_date ? (
                    new Date(med.expiry_date) < new Date() ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Expired
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        {med.expiry_date.slice(0, 10)}
                      </span>
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2  whitespace-nowrap">
                  <div ref={(el) => (barcodeRefs.current[med.id] = el)}>
                    {med.barcode ? (
                      <div className="flex flex-col  text-gray-700">
                        {/* <Barcode
                          value={med.barcode}
                          format="CODE128"
                          height={10}
                          className="w-[100px]"
                        /> */}
                        <div className="text-xs text-gray-900 ">
                          {med.barcode}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-2 whitespace-nowrap relative overflow-visible text-right">
                  <div className="inline-flex items-center gap-2">
                    {openOptions === med.id && (
                      <div className="absolute bg-white border flex  border-gray-200 rounded-lg shadow-lg right-14 top-2 z-10">
                        <button
                          onClick={() => handleEdit(med)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(med.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(med.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenOptions(med.id)}
                      className="p-2 text-blue-600 w-7 h-7 bg-gray-200 rounded-full hover:bg-blue-50 flex items-center justify-center transition-colors"
                    >
                      <TbDotsVertical className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700" />
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
                    <p className="text-lg font-medium">No medicines found</p>
                    <p className="text-sm mt-1">
                      {searchTerm || showExpiringSoon
                        ? "Try changing your search or filter"
                        : "Add your first medicine to get started"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredMedicines.length} of {medicines.length} medicines
        {showExpiringSoon && " (Expiring within 30 days)"}
      </div>
    </>
  );
};

export default MedicineList;
