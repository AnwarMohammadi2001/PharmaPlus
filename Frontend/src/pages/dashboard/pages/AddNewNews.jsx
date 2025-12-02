import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FiUpload,
  FiImage,
  FiFileText,
  FiTag,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiEye,
  FiPlus,
  FiSave,
  FiType,
  FiFile,
} from "react-icons/fi";

const AddNewNews = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");

  // Common categories
  const categories = [
    "Technology",
    "Business",
    "Health",
    "Entertainment",
    "Sports",
    "Science",
    "Education",
    "Politics",
    "Lifestyle",
    "Travel",
  ];

  // Mutation function
  const createNews = async (formDataToSend) => {
    const res = await fetch("http://localhost:5000/api/news", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add news");

    return data;
  };

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      setMessage({
        type: "success",
        text: "🎉 News article published successfully!",
      });
      setFormData({ title: "", content: "", category: "" });
      setImage(null);
      setImagePreview(null);
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text: error.message,
      });
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("category", formData.category);

    if (image) formDataToSend.append("image", image);

    mutation.mutate(formDataToSend);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <FiPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Article
              </h1>
              <p className="text-gray-600 mt-2">
                Share your news with the community
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-8 p-4 rounded-xl border-l-4 shadow-md ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {message.type === "success" ? (
                  <FiCheckCircle className="w-5 h-5 mr-3" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 mr-3" />
                )}
                <p className="font-medium">{message.text}</p>
              </div>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <FiType className="w-4 h-4 mr-2 text-blue-600" />
                      Article Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-lg font-medium"
                      placeholder="Enter a compelling headline..."
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <FiTag className="w-4 h-4 mr-2 text-blue-600" />
                      Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, category: cat }))
                          }
                          className={`px-4 py-2.5 rounded-lg border transition-all duration-200 font-medium ${
                            formData.category === cat
                              ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                              : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Or type a custom category..."
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <FiFileText className="w-4 h-4 mr-2 text-blue-600" />
                      Content *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none min-h-[200px] resize-y"
                      placeholder="Write your article content here. You can use Markdown for formatting..."
                      required
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formData.content.length} characters
                      </span>
                      <span className="text-xs text-gray-500">
                        Minimum 100 characters recommended
                      </span>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <FiImage className="w-4 h-4 mr-2 text-blue-600" />
                      Featured Image
                    </label>

                    {imagePreview ? (
                      <div className="relative group">
                        <input
                          type="file"
                          onChange={(e) => setImage(e.target.files[0])}
                          className="w-full"
                          accept="image/*"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center space-x-4">
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("image-upload").click()
                            }
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                          <div className="flex flex-col items-center">
                            <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200 mb-4">
                              <FiUpload className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-gray-700 font-medium mb-1">
                              Click to upload an image
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                            <button
                              type="button"
                              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                            >
                              Browse Files
                            </button>
                          </div>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {mutation.isPending ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Publishing Article...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5 mr-3" />
                          Publish Article
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Guidelines */}
          <div className="space-y-8">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FiEye className="w-5 h-5 mr-2" />
                  Live Preview
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {formData.title || "Your article title will appear here"}
                    </h4>
                    {formData.category && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                        {formData.category}
                      </span>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {formData.content ||
                        "Article content preview will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiFile className="w-5 h-5 mr-2 text-blue-600" />
                Publishing Guidelines
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Ensure your title is clear and descriptive
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Choose an appropriate category for better reach
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Add a high-quality image to attract readers
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">4</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Proofread your content before publishing
                  </span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  💡 Tips for great articles
                </p>
                <p className="text-xs text-gray-600">
                  Keep paragraphs short, use subheadings, and add relevant
                  images to improve readability.
                </p>
              </div>
            </div>

            {/* Character Count Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Article Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Title Length</span>
                    <span>{formData.title.length}/100</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        formData.title.length > 60
                          ? "bg-green-500"
                          : formData.title.length > 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(formData.title.length, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Content Length</span>
                    <span>{formData.content.length}/2000</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        formData.content.length > 1000
                          ? "bg-green-500"
                          : formData.content.length > 500
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          formData.content.length / 20,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            All articles are reviewed before publication to ensure quality
            content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddNewNews;
