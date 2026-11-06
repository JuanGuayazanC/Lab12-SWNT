import { useMemo } from "react";
import { Activity, Leaf, RefreshCw, TrendingDown } from "lucide-react";
import { useEmissions } from "../hooks/useEmissions";
import { EmissionCard } from "./EmissionCard";
import { EmissionForm } from "./EmissionForm";

export default function EmissionsTracker() {
  const { emissions, loading, saving, error, loadEmissions, addEmission, isDemo } = useEmissions();
  const total = useMemo(
    () => emissions.reduce((sum, item) => sum + Number(item.co2_amount), 0),
    [emissions],
  );
  const categories = useMemo(
    () => new Set(emissions.map((item) => item.category)).size,
    [emissions],
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Leaf size={17} aria-hidden="true" /> ECOTRACK
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Dashboard de emisiones</h1>
            <p className="mt-2 text-sm text-slate-500">Monitorea las fuentes de CO₂ y registra nuevas mediciones.</p>
          </div>
          <button onClick={() => void loadEmissions()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
            <RefreshCw size={16} aria-hidden="true" /> Actualizar
          </button>
        </header>

        {isDemo && (
          <p role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Modo demostración: configura las variables de Supabase para guardar y sincronizar datos reales.
          </p>
        )}

        <section aria-label="Resumen de emisiones" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-emerald-700 p-5 text-white">
            <div className="flex justify-between"><p className="text-sm text-emerald-100">Emisiones registradas</p><Activity aria-hidden="true" /></div>
            <p className="mt-4 text-3xl font-bold">{total.toLocaleString("es-CO", { maximumFractionDigits: 2 })} kg</p>
            <p className="mt-1 text-xs text-emerald-100">CO₂ acumulado</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between"><p className="text-sm text-slate-500">Mediciones</p><TrendingDown className="text-emerald-600" aria-hidden="true" /></div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{emissions.length}</p>
            <p className="mt-1 text-xs text-slate-500">Registros disponibles</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between"><p className="text-sm text-slate-500">Categorías activas</p><Leaf className="text-emerald-600" aria-hidden="true" /></div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{categories}</p>
            <p className="mt-1 text-xs text-slate-500">Transporte, energía y residuos</p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Agregar medición</h2>
          <p className="mb-5 mt-1 text-sm text-slate-500">Registra una nueva fuente de emisiones.</p>
          <EmissionForm onSubmit={addEmission} saving={saving} />
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div><h2 className="text-lg font-semibold text-slate-900">Fuentes de emisión</h2>
              <p className="mt-1 text-sm text-slate-500">Detalle de las mediciones registradas.</p></div>
            <span className="text-sm text-slate-500">{emissions.length} registros</span>
          </div>
          {loading ? (
            <p role="status" className="rounded-xl bg-white p-10 text-center text-sm text-slate-500">Cargando mediciones...</p>
          ) : emissions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              Todavía no hay mediciones. Agrega la primera.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {emissions.map((item) => <EmissionCard key={item.id} item={item} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
