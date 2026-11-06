import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Emission, NewEmission } from "../types/emission";

const demo: Emission[] = [
  { id: "d1", source_name: "Flota de vehículos", category: "Transporte", co2_amount: 128.4, created_at: new Date().toISOString() },
  { id: "d2", source_name: "Consumo eléctrico", category: "Energía", co2_amount: 86.2, created_at: new Date().toISOString() },
  { id: "d3", source_name: "Residuos de oficina", category: "Residuos", co2_amount: 24.8, created_at: new Date().toISOString() },
];

export function useEmissions() {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmissions = useCallback(async () => {
    if (!supabase) {
      setEmissions(demo);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from("emissions")
        .select("id, source_name, category, co2_amount, created_at")
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;
      setEmissions((data ?? []) as Emission[]);
    } catch {
      setError("No se pudieron cargar las mediciones. Comprueba la conexión y los permisos de Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmission = useCallback(async (input: NewEmission): Promise<boolean> => {
    setSaving(true);
    setError(null);

    if (!supabase) {
      setEmissions((current) => [
        { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() },
        ...current,
      ]);
      setSaving(false);
      return true;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("emissions")
        .insert(input)
        .select("id, source_name, category, co2_amount, created_at")
        .single();

      if (insertError) throw insertError;
      if (data) setEmissions((current) => [data as Emission, ...current]);
      return true;
    } catch {
      setError("No se pudo guardar la medición. Verifica los datos y los permisos de Supabase.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    void loadEmissions();
    if (!supabase) return;

    const channel = supabase
      .channel("emissions-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "emissions" }, () => {
        void loadEmissions();
      })
      .subscribe();

    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [loadEmissions]);

  return {
    emissions,
    loading,
    saving,
    error,
    loadEmissions,
    addEmission,
    isDemo: !isSupabaseConfigured,
  };
}
