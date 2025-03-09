import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../config/supabase";
import { SiteSettings } from "../types";

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: ${({ theme }) =>
    `${theme.space[4]} ${theme.space[6]} ${theme.space[8]}`};
`;

const LoadingBox = styled.div`
  height: 40px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s infinite;
`;

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

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.blue[500]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export function SettingsForm() {
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    title: "",
    subtitle: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) throw error;
      if (data) setSettings(data);
      setIsInitialLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      setIsInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert(settings, { onConflict: "id" });

      if (error) throw error;
      alert("Settings updated successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating settings");
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <Container>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <LoadingBox />
          <LoadingBox />
          <LoadingBox />
        </div>
      </Container>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel htmlFor="title">Título do Site</FormLabel>
        <Input
          id="title"
          value={settings.title}
          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          placeholder="Digite o título do site"
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="subtitle">Subtítulo do Site</FormLabel>
        <Input
          id="subtitle"
          value={settings.subtitle}
          onChange={(e) =>
            setSettings({ ...settings, subtitle: e.target.value })
          }
          placeholder="Digite o subtítulo do site"
          required
        />
      </FormControl>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Atualizar Configurações"}
      </Button>
    </form>
  );
}
