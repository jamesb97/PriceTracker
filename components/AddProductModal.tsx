import React, { useState, useCallback } from "react";
import { X, Search, Loader2, AlertCircle } from "lucide-react";
import { analyzeProduct } from "../services/gemini";
import { Product } from "../types";
import { v4 as uuidv4 } from "uuid";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        const analyzedData = await analyzeProduct(query);

        const imageSeed =
          (analyzedData as any).imageSeed ??
          Math.floor(Math.random() * 1000).toString();

        const newProduct: Product = {
          ...analyzedData,
          id: uuidv4(),
          imageSeed,
          addedAt: Date.now(),
        };

        onProductAdded(newProduct);
        setQuery("");
        onClose();
      } catch (err: any) {
        console.error("Failed to analyze product", err);
        setError(
          "Could not find or analyze this product. Please try a different name or check your connection."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [query, onProductAdded, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Track New Product
              </h2>
              <p className="text-gray-500 mt-1">
                Enter a product URL or name (e.g. "Sony Headphones")
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                placeholder="Paste Amazon URL or type a product name..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 placeholder-gray-400 transition-shadow"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Market Data...</span>
                  </>
                ) : (
                  <span>Start Tracking</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Powered by Gemini 2.5 Flash • Simulates real-time market analysis
            </p>
          </div>
        </div>

        {/* Decorative loading bar */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 animate-[loading_2s_ease-in-out_infinite] w-full" />
        )}
      </div>
      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
