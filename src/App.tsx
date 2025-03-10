import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { ProductForm } from "./components/ProductForm";
import { ProductList } from "./components/ProductList";
import { SettingsForm } from "./components/SettingsForm";
import { supabase } from "./config/supabase";
import { EditProduct } from "./pages/EditProduct";
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

  const productContent = (
    <>
      <Box>
        <ProductForm onSuccess={loadProducts} />
      </Box>
      <ProductList products={products} onDelete={handleDeleteProduct} />
    </>
  );

  return (
    <>
      <AdminLayout
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        productContent={productContent}
        settingsContent={<SettingsForm />}
      />
      <Routes>
        <Route path="/edit/:id" element={<EditProduct />} />
      </Routes>
    </>
  );
}

export default AppContent;
