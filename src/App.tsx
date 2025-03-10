import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "./config/supabase";
import { AuthProvider } from "./contexts/AuthProvider";
import { AppRoutes } from "./routes";
import { Product } from "./types";

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
      toast({
        title: "Error loading products",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Product deleted successfully",
        status: "success",
      });
      loadProducts();
    } catch (error) {
      toast({
        title: "Error deleting product",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
      });
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
