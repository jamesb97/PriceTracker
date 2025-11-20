import React from "react";
import { Product, DealStatus } from "../types";
import { TrendingDown, TrendingUp, Minus, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
}) => {
  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case DealStatus.GREAT:
        return "bg-green-100 text-green-700 border-green-200";
      case DealStatus.GOOD:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case DealStatus.FAIR:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case DealStatus.BAD:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  // Calculate rudimentary trend
  const lastPrice =
    product.history[product.history.length - 2]?.price || product.currentPrice;
  const priceDiff = product.currentPrice - lastPrice;

  return (
    <div
      onClick={() => onClick(product)}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(
            product.dealStatus
          )}`}
        >
          {product.dealStatus} Deal
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-semibold text-gray-700">{product.rating}</span>
          <span className="text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Current Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {product.currency}
                {product.currentPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.currency}
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              priceDiff < 0
                ? "text-green-600"
                : priceDiff > 0
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {priceDiff < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : priceDiff > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>
              {priceDiff === 0
                ? "No change"
                : `${Math.abs(Math.round((priceDiff / lastPrice) * 100))}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
