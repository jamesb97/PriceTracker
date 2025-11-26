import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { AddProductModal } from "./components/AddProductModal";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { Product } from "./types";
import { Ghost } from "lucide-react";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("primetrack_products");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved products", e);
      }
    }
  }, []);

  // Save to local storage whenever products change
  useEffect(() => {
    localStorage.setItem("primetrack_products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = useCallback((newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const handleDeleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    },
    [selectedProduct]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddClick={() => setIsAddModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            {products.length === 0
              ? "You aren't tracking any products yet."
              : `Tracking ${products.length} product${
                  products.length === 1 ? "" : "s"
                }.`}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Ghost className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No products tracked
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Start tracking products to get AI-powered price analysis and deal
              alerts.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleAddProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default App;
