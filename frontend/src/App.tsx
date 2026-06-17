import { useMetrics } from './hooks/useMetrics';
import { HostnameCard } from './components/HostnameCard';
import { MetricCard } from './components/MetricCard';

function formatUptime(s: number) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s % 60}s`].filter(Boolean).join(' ');
}

function RamBar({ used, total }: { used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  const color = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-400' : 'bg-emerald-400';
  return (
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>Usage</span>
          <span className="font-mono font-semibold text-white">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-600">
          <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
  );
}

export default function App() {
  const { data, error, loading } = useMetrics();

  return (
      <div className="min-h-screen bg-slate-900 p-6 text-white">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Infrastructure<span className="text-indigo-400">Insight</span></h1>
            <p className="text-sm text-slate-400">Real-time telemetry · refresh 2.5s</p>
          </div>
          <span className={`h-3 w-3 rounded-full ${error ? 'bg-red-500' : loading ? 'animate-pulse bg-yellow-400' : 'bg-emerald-400'}`} />
        </header>

        {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              Error: {error}
            </div>
        )}

        {loading && !data && <p className="animate-pulse py-24 text-center text-slate-500">Connecting…</p>}

        {data && (
            <div className="mx-auto max-w-4xl space-y-6">
              <HostnameCard hostname={data.hostname} timestamp={data.timestamp} />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard title="OS" icon="🖥️" accent="from-cyan-800 to-cyan-900"
                            rows={[{ label: 'Type', value: data.os.type }, { label: 'Platform', value: data.os.platform }, { label: 'Release', value: data.os.release }]} />
                <MetricCard title="CPU" icon="⚙️" accent="from-violet-800 to-violet-900"
                            rows={[{ label: 'Cores', value: data.cpu.cores }, { label: 'Model', value: data.cpu.model.slice(0, 26) + (data.cpu.model.length > 26 ? '…' : '') },
                              { label: 'Load 1m', value: data.cpu.loadAvg[0]?.toFixed(2) ?? '—' },
                              { label: 'Load 5m', value: data.cpu.loadAvg[1]?.toFixed(2) ?? '—' }]} />
                <div className="rounded-2xl bg-gradient-to-br from-teal-800 to-teal-900 p-6 shadow-lg">
                  <div className="mb-4 flex items-center gap-3"><span className="text-2xl">💾</span><h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">RAM</h2></div>
                  <dl className="space-y-2">
                    {[['Total', `${data.ram.total} MB`], ['Used', `${data.ram.used} MB`], ['Free', `${data.ram.free} MB`]].map(([l, v]) => (
                        <div key={l} className="flex justify-between"><dt className="text-sm text-slate-400">{l}</dt><dd className="font-mono text-sm font-semibold text-white">{v}</dd></div>
                    ))}
                  </dl>
                  <RamBar used={data.ram.used} total={data.ram.total} />
                </div>
              </div>
              <MetricCard title="Uptime" icon="⏱️" accent="from-slate-700 to-slate-800"
                          rows={[{ label: 'Formatted', value: formatUptime(data.uptime) }, { label: 'Seconds', value: data.uptime.toLocaleString() }]} />
            </div>
        )}
      </div>
  );
}