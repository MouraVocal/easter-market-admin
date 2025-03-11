import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { SiteSettings } from "./types";
import { useToast } from "@/hooks/useToast";
import { SITE_STRINGS } from "../../constants";
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
  const [settings, setSettings] = useState<SiteSettings & { id?: string }>({
    title: "",
    subtitle: "",
    whatsapp_number: 0,
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
        addToast(SITE_STRINGS.ERROR_LOADING_SETTINGS, "error");
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
        throw new Error(SITE_STRINGS.SETTINGS_ID_NOT_FOUND);
      }

      const { error } = await supabase
        .from("site_settings")
        .update({
          title: settings.title,
          subtitle: settings.subtitle,
          whatsapp_number: settings.whatsapp_number,
        })
        .eq("id", settings.id);

      if (error) throw error;
      addToast(SITE_STRINGS.SETTINGS_UPDATED, "success");
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      addToast(SITE_STRINGS.ERROR_UPDATING_SETTINGS, "error");
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
        <FormLabel htmlFor="title">{SITE_STRINGS.SITE_TITLE}</FormLabel>
        <Input
          id="title"
          value={settings.title}
          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          placeholder={SITE_STRINGS.ENTER_SITE_TITLE}
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="subtitle">{SITE_STRINGS.SITE_SUBTITLE}</FormLabel>
        <Input
          id="subtitle"
          value={settings.subtitle}
          onChange={(e) =>
            setSettings({ ...settings, subtitle: e.target.value })
          }
          placeholder={SITE_STRINGS.ENTER_SITE_SUBTITLE}
          required
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="whatsapp_number">
          {SITE_STRINGS.WHATSAPP_NUMBER}
        </FormLabel>
        <Input
          id="whatsapp_number"
          type="number"
          value={settings.whatsapp_number}
          onChange={(e) =>
            setSettings({
              ...settings,
              whatsapp_number: Number(e.target.value),
            })
          }
          placeholder={SITE_STRINGS.ENTER_WHATSAPP}
          required
        />
      </FormControl>

      <Button type="submit" disabled={loading}>
        {loading ? SITE_STRINGS.SAVING : SITE_STRINGS.UPDATE_SETTINGS}
      </Button>
    </form>
  );
}
