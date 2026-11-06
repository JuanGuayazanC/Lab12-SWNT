import { useState, type FormEvent } from "react";
import type { EmissionCategory, NewEmission } from "../types/emission";

interface Props {
  onSubmit: (value: NewEmission) => Promise<boolean>;
  saving: boolean;
}

export function EmissionForm({ onSubmit, saving }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<EmissionCategory>("Transporte");
  const [amount, setAmount] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return;

    const saved = await onSubmit({
      source_name: name.trim(),
      category,
      co2_amount: value,
    });

    if (saved) {
      setName("");
      setCategory("Transporte");
      setAmount("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4" aria-label="Agregar medición">
      <div className="md:col-span-2">
        <label htmlFor="source" className="label">Nombre de la fuente</label>
        <input id="source" className="field" required maxLength={100} value={name}
          onChange={(event) => setName(event.target.value)} placeholder="Ej. Transporte de empleados" />
      </div>
      <div>
        <label htmlFor="category" className="label">Categoría</label>
        <select id="category" className="field" value={category}
          onChange={(event) => setCategory(event.target.value as EmissionCategory)}>
          <option>Transporte</option><option>Energía</option><option>Residuos</option>
        </select>
      </div>
      <div>
        <label htmlFor="amount" className="label">CO₂ (kg)</label>
        <input id="amount" className="field" type="number" min="0.01" step="0.01"
          required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="42.5" />
      </div>
      <div className="md:col-span-4 flex justify-end">
        <button type="submit" disabled={saving}
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Guardando..." : "Agregar medición"}
        </button>
      </div>
    </form>
  );
}
