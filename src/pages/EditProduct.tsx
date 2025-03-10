import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Heading, Box } from "@chakra-ui/react";
import { ProductForm } from "../components/ProductForm";
import { supabase } from "../config/supabase";
import { Product } from "../types";
import { useToast } from "@chakra-ui/react";

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) setProduct(data);
      } catch (error) {
        toast({
          title: "Error loading product",
          description: error instanceof Error ? error.message : "An error occurred",
          status: "error",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={[2, 4]} px={[2, 4, 6]}>
        <Box>Loading...</Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={[2, 4]} px={[2, 4, 6]}>
      <Heading mb={[4, 6, 8]} fontSize={["xl", "2xl", "3xl"]}>
        Edit Product
      </Heading>
      {product && (
        <ProductForm
          product={product}
          onSuccess={() => navigate("/")}
        />
      )}
    </Container>
  );
}