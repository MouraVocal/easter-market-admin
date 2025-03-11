import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heading, Button, HStack } from "@chakra-ui/react";
import { ProductForm } from "@components/ProductForm";
import { supabase } from "@config/supabase";
import { useToast } from "@chakra-ui/react";
import { SITE_STRINGS } from "../../constants";
import { EditProductContainer, LoadingBox } from "./styles";
import { Product } from "src/types";

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
          title: SITE_STRINGS.ERROR_LOADING_PRODUCT,
          description:
            error instanceof Error ? error.message : "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, toast]);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: SITE_STRINGS.PRODUCT_UPDATED,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <EditProductContainer maxW="container.xl">
        <LoadingBox>{SITE_STRINGS.LOADING}</LoadingBox>
      </EditProductContainer>
    );
  }

  return (
    <EditProductContainer maxW="container.xl">
      <HStack justify="space-between" mb={[4, 6, 8]}>
        <Heading fontSize={["xl", "2xl", "3xl"]}>
          {SITE_STRINGS.EDIT_PRODUCT}
        </Heading>
        <Button
          colorScheme="gray"
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          leftIcon={<span>←</span>}
        >
          {SITE_STRINGS.BACK}
        </Button>
      </HStack>
      {product && <ProductForm product={product} onSuccess={handleSuccess} />}
    </EditProductContainer>
  );
}
