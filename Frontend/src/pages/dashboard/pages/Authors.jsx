import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MdPerson,
  MdEmail,
  MdCalendarToday,
  MdSearch,
  MdFilterList,
} from "react-icons/md";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchAuthors = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const Authors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // 🔥 USE REACT QUERY INSTEAD OF useEffect
  const {
    data: authors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  // 🔥 FILTER & SORT
  const filteredAuthors = React.useMemo(() => {
    if (!authors) return [];

    let result = authors.filter(
      (author) =>
        author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result = result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [authors, searchTerm, sortBy]);

  // Helpers
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const getRandomColor = (name) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-orange-500 to-orange-600",
      "bg-gradient-to-r from-teal-500 to-teal-600",
    ];
    return colors[name?.length % colors.length] || colors[0];
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <MdPerson className="text-red-500 text-4xl mx-auto mb-3" />
            <h2 className="text-red-800 text-xl font-semibold mb-2">
              Error Loading Authors
            </h2>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Authors</h1>
        <p className="text-gray-600 mb-8">
          Manage and view all authors in the system
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Authors */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-gray-600 text-sm">Total Authors</p>
            <p className="text-3xl font-bold mt-1">{authors.length}</p>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-gray-600 text-sm">Active Users</p>
            <p className="text-3xl font-bold mt-1">{authors.length}</p>
          </div>

          {/* New this month */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-gray-600 text-sm">New This Month</p>
            <p className="text-3xl font-bold mt-1">
              {
                authors.filter((a) => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(a.createdAt) > monthAgo;
                }).length
              }
            </p>
          </div>
        </div>

        {/* Search + sort */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="name">Sort by Name</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Authors List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {filteredAuthors.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No authors found
            </div>
          ) : (
            filteredAuthors.map((author) => (
              <div
                key={author.id}
                className="p-6 border-b last:border-b-0 hover:bg-gray-50 flex justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`${getRandomColor(
                      author.name
                    )} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {author.image ? (
                      <img
                        src={`${BASE_URL}/uploads/${author.image}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(author.name)
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">{author.name}</h3>
                    <p className="text-gray-600 text-sm">{author.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      News Articles:{" "}
                      <span className="font-medium">{author.newsCount}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right text-gray-500 text-sm">
                  Joined{" "}
                  {new Date(author.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Showing {filteredAuthors.length} of {authors.length}
        </p>
      </div>
    </div>
  );
};

export default Authors;
