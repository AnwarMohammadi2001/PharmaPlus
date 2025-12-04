import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  Folder,
  FolderOpen,
} from "lucide-react";

const BASE_URL = "http://localhost:5000/api/categories";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(BASE_URL);
      setCategories(res.data);
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      if (editingId) {
        // Update
        await axios.put(`${BASE_URL}/${editingId}`, { name });
        setEditingId(null);
      } else {
        // Add
        await axios.post(BASE_URL, { name });
      }
      setName("");
      fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message || "Operation failed. Please try again."
      );
      console.error(err);
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
    // Scroll to form
    document
      .getElementById("category-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete category
  const handleDelete = async (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/${categoryToDelete}`);
      fetchCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError("Failed to delete category. Please try again.");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="p-3  bg-primary rounded-xl shadow-lg">
                {editingId ? (
                  <FolderOpen size={32} className="text-white" />
                ) : (
                  <Folder size={32} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-700">
                  {editingId ? "Edit Category" : "Category Management"}
                </h1>
                <p className="text-gray-600">
                  {editingId
                    ? "Update your category details"
                    : "Create, edit, and manage your categories"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="">
          {/* Left Column: Form */}
          <div className="grid grid-cols-3 gap-x-5">
            <div className="bg-white rounded-md col-span-2 shadow-md p-6 overflow-hidden">
              <div className="">
                <h2 className="text-xl font-bold text-primary flex items-center">
                  <Plus size={20} className="mr-2 text-primary" />
                  {editingId ? "Edit Category" : "Add New Category"}
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                id="category-form"
                className="py-4 flex gap-x-5  items-center"
              >
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle
                      size={20}
                      className="text-red-500 mr-3 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="w-full">
                  <div className="relative ">
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError(null);
                      }}
                      className="w-full  px-4 py-3 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                      autoFocus
                    />
                    {name && (
                      <button
                        type="button"
                        onClick={() => setName("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-x-3">
                  <button
                    type="submit"
                    className=" bg-primary text-secondary h-fit  px-6 py-3 cursor-pointer rounded-md font-medium hover:opacity-90 transition flex items-center justify-center"
                  >
                    {editingId ? (
                      <>
                        <Check size={20} className="mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus size={20} className="mr-2" />
                        Add
                      </>
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 border h-fit border-gray-300 text-secondary rounded-md bg-red-500 font-medium hover:bg-red-600 cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="bg-white rounded-md  shadow-md col-span-1 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-gray-500 font-medium">
                    Total Categories
                  </p>
                  <p className="text-5xl font-bold text-gray-800 mt-2">
                    {categories.length}
                  </p>
                </div>
                <div className="p-3 bg-primary/20 rounded-md">
                  <Folder size={34} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Categories List */}
          <div className="mt-5">
            <div className="bg-white rounded-md shadow-lg overflow-hidden">
              <div className="p-6 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-700">
                    All Categories
                  </h2>
                  <div className="relative">
                    <Search
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="md:w-[400px]  px-10 py-3 border bg-secondary border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Folder size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {searchTerm
                        ? "No matching categories"
                        : "No categories yet"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Add your first category using the form"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-[#f1f2f5]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCategories.map((cat) => (
                        <tr
                          key={cat.id}
                          className="hover:bg-gray-50 even:bg-secondary odd:bg-white transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className=" py-1 text-sm font-medium  text-gray-700">
                              {cat.id}
                            </span>
                          </td>
                          <td className="px-6">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                {cat.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6  whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(cat)}
                                className="inline-flex items-center px-3 py-2 border cursor-pointer border-primary text-primary rounded-lg hover:opacity-90 transition"
                              >
                                <Edit2 size={16} className="" />
                                
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className="inline-flex items-center px-3 py-2 border border-red-500 text-red-500   rounded-lg cursor-pointer hover:opacity-90 transition"
                              >
                                <Trash2 size={16} className="" />
                                
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {filteredCategories.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredCategories.length}
                    </span>{" "}
                    of <span className="font-medium">{categories.length}</span>{" "}
                    categories
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                Delete Category
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this category? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
