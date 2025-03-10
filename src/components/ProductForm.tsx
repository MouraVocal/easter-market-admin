import { useState } from "react";
import styled from "styled-components";
import { FormLayout } from "./FormLayout";
import { supabase } from "../config/supabase";
import { Product } from "../types";
import { useToast } from "./Toast/useToast";

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

const FormControl = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue[500]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.white};
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue[500]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
`;

const InputLeftAddon = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-right: none;
  border-radius: ${({ theme }) => theme.radii.md} 0 0
    ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const NumberInput = styled(Input)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const FileInput = styled(Input)`
  padding: ${({ theme }) => theme.space[2]};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }

  &::file-selector-button {
    height: 100%;
    padding: 0 ${({ theme }) => theme.space[4]};
    background: ${({ theme }) => theme.colors.gray[50]};
    border: none;
    border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 500;
    margin-right: ${({ theme }) => theme.space[4]};
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
    }
  }
`;

const ImagePreview = styled.div`
  margin-top: ${({ theme }) => theme.space[4]};
  position: relative;
`;

const PreviewImage = styled.img`
  max-height: 200px;
  border-radius: ${({ theme }) => theme.radii.md};
  object-fit: contain;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[1]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  background-color: ${({ theme }) => theme.colors.blue[500]};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue[600]};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageUrl || null
  );

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageInput =
        document.querySelector<HTMLInputElement>("#imageInput");
      let imageUrl = formData.imageUrl;

      if (imageInput?.files?.[0]) {
        try {
          imageUrl = await handleImageUpload(imageInput.files[0]);
        } catch (error) {
          console.error("Error uploading image:", error);
          addToast("Error uploading image", "error");
          setLoading(false);
          return;
        }
      }

      const productData = { ...formData, imageUrl };

      if (product?.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
        addToast("Product updated successfully", "success");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        addToast("Product created successfully", "success");
      }

      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      addToast("Error saving product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel htmlFor="name">Nome do Produto</FormLabel>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Digite o nome do produto"
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="description">Descrição</FormLabel>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Digite a descrição do produto"
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="price">Preço</FormLabel>
        <InputGroup>
          <InputLeftAddon>R$</InputLeftAddon>
          <NumberInput
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="imageInput">Imagem do Produto</FormLabel>
        <FileInput
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {imagePreview && (
          <ImagePreview>
            <PreviewImage src={imagePreview} alt="Preview" />
            <RemoveButton
              onClick={() => {
                setImagePreview(null);
                const imageInput =
                  document.querySelector<HTMLInputElement>("#imageInput");
                if (imageInput) imageInput.value = "";
              }}
            >
              ❌
            </RemoveButton>
          </ImagePreview>
        )}
      </FormControl>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Produto"}
      </SubmitButton>
    </FormLayout>
  );
}
