import React from "react";
import { ShoppingCart, Plus, RefreshCw } from "lucide-react";

interface HeaderProps {
  onAddClick: () => void;
  onRefreshClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick, onRefreshClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 leading-none">
                Price Track
              </span>
              <span className="text-xs text-indigo-600 font-medium tracking-wider">
                AI POWERED
              </span>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Track Product</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={onRefreshClick}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
