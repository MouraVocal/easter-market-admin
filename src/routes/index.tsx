import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { RequireAuth } from "./auth";
import { AdminLayout } from "../components/AdminLayout";
import { ProductList } from "../components/ProductList";
import { ProductForm } from "../components/ProductForm";
import { SettingsForm } from "../components/SettingsForm";
import { EditProduct } from "../pages/EditProduct";
import { Box } from "@chakra-ui/react";
import { Product } from "../types";
import { AuthProvider } from "../contexts/AuthProvider";

interface AppRoutesProps {
  products: Product[];
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  onDeleteProduct: (id: string) => void;
  onProductSuccess: () => void;
}

export function AppRoutes({
  products,
  tabIndex,
  setTabIndex,
  onDeleteProduct,
  onProductSuccess,
}: AppRoutesProps) {
  const productContent = (
    <>
      <Box>
        <ProductForm onSuccess={onProductSuccess} />
      </Box>
      <ProductList products={products} onDelete={onDeleteProduct} />
    </>
  );

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AdminLayout
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                productContent={productContent}
                settingsContent={<SettingsForm onSuccess={onProductSuccess} />}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      tabIndex === 0 ? (
                        <ProductList
                          products={products}
                          onDelete={onDeleteProduct}
                        />
                      ) : (
                        <ProductForm onSuccess={onProductSuccess} />
                      )
                    }
                  />
                  <Route path="/edit/:id" element={<EditProduct />} />
                </Routes>
              </AdminLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
