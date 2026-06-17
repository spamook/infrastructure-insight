interface Props {
    title: string;
    icon: string;
    rows: { label: string; value: string | number }[];
    accent?: string;
}

export function MetricCard({ title, icon, rows, accent = 'from-slate-700 to-slate-800' }: Props) {
    return (
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-6 shadow-lg`}>
            <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">{title}</h2>
            </div>
            <dl className="space-y-2">
                {rows.map(({ label, value }) => (
                    <div key={label} className="flex items-baseline justify-between gap-4">
                        <dt className="text-sm text-slate-400 shrink-0">{label}</dt>
                        <dd className="font-mono text-sm font-semibold text-white">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}