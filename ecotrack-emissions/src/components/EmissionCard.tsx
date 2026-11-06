import { Activity, CarFront, Recycle, Zap } from "lucide-react";
import type { Emission } from "../types/emission";

const styles = {
  Transporte: { Icon: CarFront, className: "bg-blue-50 text-blue-700" },
  Energía: { Icon: Zap, className: "bg-amber-50 text-amber-700" },
  Residuos: { Icon: Recycle, className: "bg-emerald-50 text-emerald-700" },
};

export function EmissionCard({ item }: { item: Emission }) {
  const style = styles[item.category];
  const Icon = style.Icon;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{item.source_name}</h3>
          <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}>
            <Icon size={14} aria-hidden="true" />{item.category}
          </span>
        </div>
        <Activity className="text-slate-400" aria-hidden="true" />
      </div>
      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-slate-500">CO₂ producido</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">
        {Number(item.co2_amount).toLocaleString("es-CO", { maximumFractionDigits: 2 })}
        <span className="ml-2 text-sm font-medium text-slate-500">kg</span>
      </p>
    </article>
  );
}
