import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "./config/supabase";
import { AuthProvider } from "./contexts/AuthProvider";
import { AppRoutes } from "./routes";
import { Product } from "./types";
import { useToast } from "./hooks/useToast";

function AppContent() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.addToast(
        error instanceof Error ? error.message : "Error loading products",
        "error"
      );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast.addToast("Product deleted successfully", "success");
      loadProducts();
    } catch (error) {
      toast.addToast(
        error instanceof Error ? error.message : "Error deleting product",
        "error"
      );
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Box>
      <AppRoutes
        products={products}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        onDeleteProduct={handleDeleteProduct}
        onProductSuccess={loadProducts}
      />
    </Box>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default AppContent;
