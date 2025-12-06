import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { HiOutlineXMark } from "react-icons/hi2";

const CustomDropdown = ({ label, options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        className="px-4 py-2.5 bg-primary border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between w-44 hover:bg-primary/80"
      >
        <span className="text-secondary text-sm">{selected || label}</span>

        {open ? (
          <MdKeyboardArrowDown className="w-5 h-5 text-secondary" />
        ) : (
          <MdKeyboardArrowUp className="w-5 h-5 text-secondary" />
        )}
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute mt-1 bg-white border right-0 border-gray-300 rounded-lg shadow-lg w-60 max-h-[350px] overflow-y-auto z-20">
          {/* Search Box */}
          <div className="p-2 sticky flex top-0 bg-white border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <div
              onClick={() => {
                onSelect("");
                setOpen(false);
                setSearch("");
              }}
              className="px-2 py-2 text-sm cursor-pointer text-red-600 border-gray-200"
            >
                <HiOutlineXMark className="w-5 h-5" />
            </div>
          </div>

          {/* Items */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                  setSearch("");
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  selected === opt ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">No results</div>
          )}

          {/* Clear Filter */}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
