import { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { SiteSettings } from "./types";
import { useToast } from "../../hooks/useToast";
import {
  Container,
  LoadingBox,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "./styles";

interface ISettingsForm {
  onSuccess: () => void;
}

export function SettingsForm({ onSuccess }: ISettingsForm) {
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings & { id?: string }>({    title: "",
    subtitle: "",
    whatsapp_number: 0
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

      if (error) {
        addToast("Error loading settings", "error");
        throw error;
      }
      if (data) setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!settings.id) {
        throw new Error("Settings ID not found");
      }

      const { error } = await supabase
        .from("site_settings")
        .update({
          title: settings.title,
          subtitle: settings.subtitle,
          whatsapp_number: settings.whatsapp_number
        })
        .eq("id", settings.id);

      if (error) throw error;
      addToast("Settings updated successfully", "success");
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      addToast("An error occurred while updating settings", "error");
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

      <FormControl>
        <FormLabel htmlFor="whatsapp_number">WhatsApp Number</FormLabel>
        <Input
          id="whatsapp_number"
          type="number"
          value={settings.whatsapp_number}
          onChange={(e) =>
            setSettings({ ...settings, whatsapp_number: Number(e.target.value) })
          }
          placeholder="Digite o número do WhatsApp"
          required
        />
      </FormControl>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Atualizar Configurações"}
      </Button>
    </form>
  );
}
