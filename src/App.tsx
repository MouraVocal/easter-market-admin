import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "./config/supabase";
import { AuthProvider } from "./contexts/AuthProvider";
import { AppRoutes } from "./routes";
import { Product } from "./types";
import { useToast } from "@chakra-ui/react";
import { SITE_STRINGS } from "./constants";

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
        title:
          error instanceof Error ? error.message : "Error loading products",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      // First, get the product to access its image URL
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image_url")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // If product has an image, delete it from storage
      if (product?.image_url) {
        const fileName = new URL(product.image_url).pathname.split("/").pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from("products")
            .remove([fileName]);

          if (storageError) throw storageError;
        }
      }

      // Then delete the product record
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: SITE_STRINGS.PRODUCT_DELETED,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      loadProducts();
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Error deleting product",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
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
