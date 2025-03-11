import {
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  Heading,
  IconButton,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types";

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductList({ products, onDelete }: ProductListProps) {
  const navigate = useNavigate();

  return (
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
                  <Box position="relative">
                    <Box
                      bgImage={`url(${product.image_url || "/placeholder-image.jpg"})`}
                      bgSize="contain"
                      bgRepeat="no-repeat"
                      bgPosition="center"
                      h={["150px", "180px", "200px"]}
                      borderRadius="md"
                    />
                    {product.is_highlighted && (
                      <Badge
                        position="absolute"
                        top="2"
                        right="2"
                        colorScheme="yellow"
                        variant="solid"
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="full"
                      >
                        Destaque
                      </Badge>
                    )}
                  </Box>
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
                      onClick={() => navigate(`/edit/${product.id}`)}
                      mr={2}
                    />
                    <IconButton
                      size={["sm", "md"]}
                      aria-label="Delete product"
                      icon={<span>🗑️</span>}
                      onClick={() => product.id && onDelete(product.id)}
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
  );
}