import { useState, useEffect } from "react";
import styled from "styled-components";
import { ProductForm } from "./components/ProductForm";
import { SettingsForm } from "./components/SettingsForm";
import { supabase } from "./config/supabase";
import { Product } from "./types";

const Box = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space[6]} ${theme.space[8]} ${theme.space[10]}`};
`;

const VStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[8]};
`;

const Heading = styled.h1<{ size?: string }>`
  font-size: ${({ theme, size }) => theme.fontSizes[size || "4xl"]};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.blue[700]};
  text-align: center;
`;

const TabContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[200]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Tab = styled.button<{ isSelected?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.space[4]};
  font-weight: 600;
  color: ${({ theme, isSelected }) => isSelected ? theme.colors.blue[600] : theme.colors.gray[600]};
  background-color: ${({ isSelected }) => isSelected ? "white" : "transparent"};
  border: none;
  border-bottom: 2px solid ${({ theme, isSelected }) => isSelected ? theme.colors.blue[600] : "transparent"};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.blue[600]};
  }
`;

const TabPanel = styled.div`
  padding: ${({ theme }) => theme.space[8]};
`;

const SimpleGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  gap: ${({ theme }) => theme.space[8]};
  width: 100%;
`;

const Card = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.space[4]};
`;

const ImageBox = styled.div<{ url: string }>`
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: center;
  height: 240px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const IconButton = styled.button<{ variant?: string }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme, variant }) => variant === "outline" ? theme.colors.blue[600] : theme.colors.white};
  background-color: ${({ theme, variant }) => variant === "outline" ? "transparent" : theme.colors.red[500]};
  border: ${({ theme, variant }) => variant === "outline" ? `1px solid ${theme.colors.blue[600]}` : "none"};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: ${({ theme, variant }) => variant === "outline" ? theme.colors.blue[50] : theme.colors.red[600]};
  }
`;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Error loading products");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      alert("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Box>
      <Container>
        <VStack>
          <Heading>Easter Sales Admin</Heading>

          <TabContainer>
            <TabList>
              <Tab isSelected={activeTab === 0} onClick={() => setActiveTab(0)}>
                Produtos
              </Tab>
              <Tab isSelected={activeTab === 1} onClick={() => setActiveTab(1)}>
                Configurações
              </Tab>
            </TabList>

            {activeTab === 0 ? (
              <TabPanel>
                <VStack>
                  <div>
                    <Heading size="lg" style={{ marginBottom: "1.5rem" }}>
                      {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
                    </Heading>
                    <ProductForm
                      product={editingProduct || undefined}
                      onSuccess={() => {
                        loadProducts();
                        setEditingProduct(null);
                      }}
                    />
                  </div>

                  <div>
                    <Heading size="lg" style={{ marginBottom: "1.5rem" }}>
                      Product List
                    </Heading>
                    <SimpleGrid columns={columns}>
                      {products.map((product) => (
                        <Card key={product.id}>
                          <CardBody>
                            <VStack>
                              {product.imageUrl && (
                                <ImageBox url={product.imageUrl} />
                              )}
                              <Heading size="md">{product.name}</Heading>
                              <p style={{ fontSize: "1rem", color: "#4A5568" }}>
                                {product.description}
                              </p>
                              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2B6CB0" }}>
                                R$ {product.price.toFixed(2)}
                              </p>
                              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                                <IconButton
                                  variant="outline"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  ✏️
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteProduct(product.id!)}
                                >
                                  🗑️
                                </IconButton>
                              </div>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </div>
                </VStack>
              </TabPanel>
            ) : (
              <TabPanel>
                <SettingsForm />
              </TabPanel>
            )}
          </TabContainer>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
