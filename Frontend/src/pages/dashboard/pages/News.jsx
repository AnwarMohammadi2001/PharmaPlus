import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FiCalendar,
  FiUser,
  FiTag,
  FiImage,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiClock,
  FiTrendingUp,
  FiBookmark,
  FiShare2,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiHeart,
} from "react-icons/fi";
import {
  RiNewspaperLine,
  RiErrorWarningLine,
  RiLoader4Line,
} from "react-icons/ri";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchNews = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/news`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch news");
  }
  return res.json();
};

const News = () => {
  const {
    data: news = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [likedArticles, setLikedArticles] = useState({});
  const [bookmarkedArticles, setBookmarkedArticles] = useState({});

  // Extract unique categories
  const categories = ["all", ...new Set(news.map((item) => item.category))];

  // Filter and sort news
  const filteredNews = news
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  const toggleArticle = (id) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  const toggleLike = (id) => {
    setLikedArticles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleBookmark = (id) => {
    setBookmarkedArticles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RiLoader4Line className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            Loading news articles...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Fetching the latest updates
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <RiErrorWarningLine className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load News
          </h3>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div  className="bg-gradient-to-r from-blue-600 to-blue-800 h-[300px] text-white py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <RiNewspaperLine className="w-8 h-8" />
              <h1 className="text-3xl font-bold">News Feed</h1>
            </div>
            <div className="text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="font-medium">{filteredNews.length}</span>{" "}
              articles
            </div>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Stay updated with the latest news, announcements, and insights from
            our community
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Sort */}
            <div className="relative">
              <FiTrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all duration-200"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <RiNewspaperLine className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No Articles Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Article Image */}
                {item.image && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`${BASE_URL}/uploads/${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => toggleLike(item.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                          likedArticles[item.id]
                            ? "bg-red-500/90 text-white"
                            : "bg-white/90 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <FiHeart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                          bookmarkedArticles[item.id]
                            ? "bg-blue-500/90 text-white"
                            : "bg-white/90 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <FiBookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      <FiTag className="w-3 h-3 mr-1" />
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {getTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => toggleArticle(item.id)}
                    className="text-xl font-bold text-gray-900 mb-3 cursor-pointer hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  {/* Content Preview */}
                  <div
                    className={`text-gray-600 mb-4 transition-all duration-300 ${
                      expandedArticle === item.id
                        ? "line-clamp-none"
                        : "line-clamp-3"
                    }`}
                  >
                    {item.content}
                  </div>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {item.author?.name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.author?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <FiUser className="w-3 h-3 mr-1" />
                          {item.author?.email || "No email provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleArticle(item.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                      >
                        {expandedArticle === item.id
                          ? "Show Less"
                          : "Read More"}
                        {expandedArticle === item.id ? (
                          <FiChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <FiChevronRight className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Article Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiEye className="w-4 h-4 mr-1" />
                        1.2k views
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                      <FiShare2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {filteredNews.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-12">
            <div className="flex flex-wrap items-center justify-between">
              <div className="text-center px-6 py-4">
                <div className="text-3xl font-bold">{filteredNews.length}</div>
                <div className="text-blue-100">Articles</div>
              </div>
              <div className="text-center px-6 py-4">
                <div className="text-3xl font-bold">
                  {Object.values(likedArticles).filter(Boolean).length}
                </div>
                <div className="text-blue-100">Likes</div>
              </div>
              <div className="text-center px-6 py-4">
                <div className="text-3xl font-bold">
                  {Object.values(bookmarkedArticles).filter(Boolean).length}
                </div>
                <div className="text-blue-100">Saved</div>
              </div>
              <div className="text-center px-6 py-4">
                <div className="text-3xl font-bold">
                  {categories.length - 1}
                </div>
                <div className="text-blue-100">Categories</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p className="flex items-center justify-center">
            <RiNewspaperLine className="w-4 h-4 mr-2" />
            Last updated: {new Date().toLocaleDateString()} • Showing{" "}
            {filteredNews.length} of {news.length} articles
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;
