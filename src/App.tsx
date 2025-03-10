import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ProductForm } from "./components/ProductForm";
import { SettingsForm } from "./components/SettingsForm";
import { supabase } from "./config/supabase";
import { Product } from "./types";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const toast = useToast();

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
    <Container maxW="container.xl" py={[2, 4]} px={[2, 4, 6]}>
      <Heading mb={[4, 6, 8]} fontSize={["xl", "2xl", "3xl"]}>
        Admin Panel
      </Heading>
      <Tabs variant="enclosed">
        <TabList
          overflowX="auto"
          overflowY="hidden"
          whiteSpace="nowrap"
          mb={[2, 4]}
        >
          <Tab p={[2, 3, 4]}>Products</Tab>
          <Tab p={[2, 3, 4]}>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={[2, 4]} py={4}>
            <VStack spacing={[4, 6, 8]} align="stretch">
              <Box>
                <Heading size={["sm", "md"]} mb={[2, 4]}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </Heading>
                <ProductForm
                  product={editingProduct || undefined}
                  onSuccess={() => {
                    loadProducts();
                    setEditingProduct(null);
                  }}
                />
              </Box>

              <Box>
                <Heading size={["sm", "md"]} mb={[2, 4]}>
                  Product List
                </Heading>
                <Grid
                  templateColumns={[
                    "1fr",
                    "repeat(auto-fill, minmax(250px, 1fr))",
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  ]}
                  gap={[2, 3, 4]}
                >
                  {products.map((product) => (
                    <GridItem key={product.id}>
                      <Card>
                        <CardBody>
                          <VStack align="stretch" spacing={2}>
                            <Box
                              bgImage={`url(${
                                product.image_url || "/placeholder-image.jpg"
                              })`}
                              bgSize="contain"
                              bgRepeat={"no-repeat"}
                              bgPosition="center"
                              h={["150px", "180px", "200px"]}
                              borderRadius="md"
                            />
                            <Heading size="sm" noOfLines={2}>
                              {product.name}
                            </Heading>
                            <Box noOfLines={3}>{product.description}</Box>
                            <Box fontWeight="bold">
                              R$ {product.price.toFixed(2)}
                            </Box>
                            <Box>
                              <IconButton
                                size={["sm", "md"]}
                                aria-label="Edit product"
                                icon={<span>✏️</span>}
                                onClick={() => setEditingProduct(product)}
                                mr={2}
                              />
                              <IconButton
                                size={["sm", "md"]}
                                aria-label="Delete product"
                                icon={<span>🗑️</span>}
                                onClick={() =>
                                  product.id && handleDeleteProduct(product.id)
                                }
                                colorScheme="red"
                              />
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel px={[2, 4]} py={4}>
            <Box>
              <Heading size={["sm", "md"]} mb={[2, 4]}>
                Site Settings
              </Heading>
              <SettingsForm />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default App;
