import React from "react";
import { Package, DollarSign, AlertCircle, Calendar } from "lucide-react";

const Stats = ({ stats }) => {
  return (
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
};

export default Stats;
