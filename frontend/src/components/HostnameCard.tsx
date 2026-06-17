export function HostnameCard({ hostname, timestamp }: { hostname: string; timestamp: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">Active Host</p>
            <h1 className="mt-2 break-all font-mono text-4xl font-black text-white md:text-5xl">
                {hostname}
            </h1>
            <p className="mt-4 text-xs text-indigo-300">
                Last updated: {new Date(timestamp).toLocaleTimeString()}
            </p>
            <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-8 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        </div>
    );
}