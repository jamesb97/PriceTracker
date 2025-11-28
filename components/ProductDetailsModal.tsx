import React from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Product, DealStatus } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onDelete,
}) => {
  if (!product) return null;

  const formatCurrency = (val: number) => `${product.currency}${val}`;

  // Prepare data for chart
  const chartData = product.history.map((p) => ({
    date: new Date(p.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: p.price,
    fullDate: p.date,
  }));

  const minPrice = Math.min(...product.history.map((h) => h.price));
  const maxPrice = Math.max(...product.history.map((h) => h.price));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image & Quick Stats */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 sm:p-8 flex flex-col gap-6">
          <div className="rounded-xl overflow-hidden shadow-md bg-white aspect-square">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Deal Verdict
              </h4>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg border ${
                  product.dealStatus === DealStatus.GREAT
                    ? "bg-green-100 text-green-700 border-green-200"
                    : product.dealStatus === DealStatus.GOOD
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : product.dealStatus === DealStatus.FAIR
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {product.dealStatus === DealStatus.GREAT && (
                  <TrendingDown className="w-5 h-5" />
                )}
                {product.dealStatus === DealStatus.BAD && (
                  <TrendingUp className="w-5 h-5" />
                )}
                {product.dealStatus} Price
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">
                Lowest Price (30d)
              </h4>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(minPrice)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">
                Highest Price (30d)
              </h4>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(maxPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Chart */}
        <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col">
          <div className="mb-8">
            <span className="text-indigo-600 font-medium text-sm">
              {product.category}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-3">
              {product.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex-1 min-h-[300px] mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Price History</h3>
              <span className="text-xs text-gray-500">Last 30 Days</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    minTickGap={30}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickFormatter={(val) => `${product.currency}${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => [
                      `${product.currency}${value}`,
                      "Price",
                    ]}
                    labelStyle={{
                      color: "#6b7280",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-indigo-900 mb-1">
                  AI Buying Advice
                </h4>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  {product.advice}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-4 pt-6 border-t border-gray-100">
            <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2" onClick={() => window.open(product.url, "_blank")}>
              <ExternalLink className="w-4 h-4" />
              View on Amazon
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
              Stop Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
