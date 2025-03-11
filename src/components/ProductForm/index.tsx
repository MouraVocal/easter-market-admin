import { useState } from "react";
import { supabase } from "../../config/supabase";
import { useToast } from "../../hooks/useToast";
import { Input } from "../../styles/elements/Input.styles";
import { FormLayout } from "../FormLayout";
import {
  FileInput,
  FormControl,
  FormLabel,
  ImagePreview,
  InputGroup,
  InputLeftAddon,
  PreviewImage,
  RemoveButton,
  SubmitButton,
  Textarea,
} from "./styles";
import { Product, ProductFormProps } from "./types";

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    image_url: product?.image_url || "",
    is_highlighted: product?.is_highlighted || false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null
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
      let imageUrl = formData.image_url;

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

      const productData = { ...formData, image_url: imageUrl };

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
          <Input
            id="price"
            type="number"
            value={formData.price === 0 ? "" : formData.price}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({
                ...formData,
                price: value === "" ? 0 : Number(value),
              });
            }}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="is_highlighted">Destaque</FormLabel>
        <input
          type="checkbox"
          id="is_highlighted"
          checked={formData.is_highlighted}
          onChange={(e) =>
            setFormData({ ...formData, is_highlighted: e.target.checked })
          }
        />
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
